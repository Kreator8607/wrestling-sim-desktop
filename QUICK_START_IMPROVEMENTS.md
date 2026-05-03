# Pro Wrestling Sim - Quick Start Guide para Melhorias

**Objetivo:** Implementar as 5 melhorias mais impactantes em 2 semanas  
**Público:** Comunidade Competitiva  
**Resultado:** Plataforma pronta para competições profissionais

---

## 🚀 Semana 1: Fundação

### Dia 1-2: Setup do Ambiente

#### 1. Criar Docker Compose para PostgreSQL + Redis
```bash
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: wrestling_sim
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  postgres_data:
  redis_data:
```

```bash
# Iniciar
docker-compose up -d

# Verificar
docker-compose ps
```

#### 2. Instalar Dependências Necessárias
```bash
npm install prisma @prisma/client
npm install ioredis
npm install socket.io socket.io-client
npm install vitest @vitest/ui
npm install recharts
npm install @shadcn/ui
npm install -D tailwindcss postcss autoprefixer
```

#### 3. Configurar Prisma ORM
```bash
# Inicializar Prisma
npx prisma init

# Configurar .env
DATABASE_URL="postgresql://admin:password@localhost:5432/wrestling_sim"
REDIS_URL="redis://localhost:6379"
```

---

### Dia 3-5: Migração para PostgreSQL

#### 1. Criar Schema Prisma
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Promotion {
  id        String   @id @default(cuid())
  name      String   @unique
  country   String?
  prestige  Int      @default(50)
  budget    BigInt   @default(1000000)
  audience  Int      @default(10000)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  workers   Worker[]
  titles    Title[]
  events    Event[]
}

model Worker {
  id          String   @id @default(cuid())
  name        String   @unique
  promotion   Promotion @relation(fields: [promotionId], references: [id])
  promotionId String
  
  // Atributos
  strength    Int      @default(50)
  speed       Int      @default(50)
  technique   Int      @default(50)
  endurance   Int      @default(50)
  charisma    Int      @default(50)
  
  // Rating
  currentElo  Int      @default(1600)
  peakElo     Int      @default(1600)
  
  // Estatísticas
  totalMatches Int     @default(0)
  wins        Int      @default(0)
  losses      Int      @default(0)
  draws       Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  matchesAsParticipant MatchParticipant[]
  matchesAsWinner      Match[] @relation("winner")
  titleReigns          TitleReign[]
}

model Title {
  id          String   @id @default(cuid())
  name        String
  promotion   Promotion @relation(fields: [promotionId], references: [id])
  promotionId String
  prestige    Int      @default(50)
  
  currentChampion   Worker?    @relation("currentChampion", fields: [currentChampionId], references: [id])
  currentChampionId String?
  
  reigns      TitleReign[]
  matches     Match[]
  
  createdAt   DateTime @default(now())
  
  @@unique([name, promotionId])
}

model TitleReign {
  id          String   @id @default(cuid())
  title       Title    @relation(fields: [titleId], references: [id])
  titleId     String
  champion    Worker   @relation(fields: [championId], references: [id])
  championId  String
  
  startDate   DateTime @default(now())
  endDate     DateTime?
  defenses    Int      @default(0)
  
  createdAt   DateTime @default(now())
}

model Event {
  id          String   @id @default(cuid())
  name        String
  promotion   Promotion @relation(fields: [promotionId], references: [id])
  promotionId String
  eventDate   DateTime
  location    String?
  attendance  Int      @default(0)
  
  matches     Match[]
  
  createdAt   DateTime @default(now())
}

model Match {
  id          String   @id @default(cuid())
  event       Event    @relation(fields: [eventId], references: [id])
  eventId     String
  
  title       Title?   @relation(fields: [titleId], references: [id])
  titleId     String?
  
  matchType   String   @default("singles")
  quality     Int      @default(0)
  
  winner      Worker?  @relation("winner", fields: [winnerId], references: [id])
  winnerId    String?
  
  participants MatchParticipant[]
  
  createdAt   DateTime @default(now())
}

model MatchParticipant {
  id        String @id @default(cuid())
  match     Match  @relation(fields: [matchId], references: [id], onDelete: Cascade)
  matchId   String
  worker    Worker @relation(fields: [workerId], references: [id])
  workerId  String
  position  Int?
  
  @@unique([matchId, workerId])
}
```

#### 2. Executar Migrations
```bash
# Criar migration
npx prisma migrate dev --name init

# Verificar schema
npx prisma studio
```

#### 3. Migrar Dados de sql.js para PostgreSQL
```javascript
// scripts/migrate-data.js
import { PrismaClient } from '@prisma/client';
import WrestlingSimDatabase from '../src/db/database.js';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    const sqliteDb = new WrestlingSimDatabase('./old-data.db');
    await sqliteDb.initialize();
    
    // Migrar promoções
    const promotions = sqliteDb.query('SELECT * FROM promotions');
    for (const promo of promotions) {
      await prisma.promotion.create({
        data: {
          name: promo.name,
          country: promo.country,
          prestige: 50
        }
      });
    }
    
    // Migrar workers
    const workers = sqliteDb.query('SELECT * FROM wrestlers');
    for (const worker of workers) {
      await prisma.worker.create({
        data: {
          name: worker.name,
          promotionId: worker.promotion_id,
          strength: 50,
          speed: 50,
          technique: 50,
          endurance: 50,
          charisma: 50
        }
      });
    }
    
    console.log('✅ Migração concluída!');
    sqliteDb.close();
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
```

```bash
node scripts/migrate-data.js
```

---

### Dia 6-7: Sistema ELO Básico

#### 1. Criar Serviço de ELO
```javascript
// src/services/eloService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const K_FACTOR = 32; // Fator de volatilidade

export async function calculateELORating(winnerId, loserId) {
  const winner = await prisma.worker.findUnique({
    where: { id: winnerId }
  });
  
  const loser = await prisma.worker.findUnique({
    where: { id: loserId }
  });
  
  if (!winner || !loser) throw new Error('Worker not found');
  
  // Calcular ELO esperado
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.currentElo - winner.currentElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winner.currentElo - loser.currentElo) / 400));
  
  // Calcular novo ELO
  const newWinnerElo = Math.round(winner.currentElo + K_FACTOR * (1 - expectedWinner));
  const newLoserElo = Math.round(loser.currentElo + K_FACTOR * (0 - expectedLoser));
  
  // Atualizar no banco
  await prisma.worker.update({
    where: { id: winnerId },
    data: {
      currentElo: newWinnerElo,
      peakElo: Math.max(winner.peakElo, newWinnerElo),
      wins: { increment: 1 },
      totalMatches: { increment: 1 }
    }
  });
  
  await prisma.worker.update({
    where: { id: loserId },
    data: {
      currentElo: newLoserElo,
      losses: { increment: 1 },
      totalMatches: { increment: 1 }
    }
  });
  
  return { newWinnerElo, newLoserElo };
}

export async function getGlobalRankings(limit = 100) {
  return prisma.worker.findMany({
    orderBy: { currentElo: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      currentElo: true,
      peakElo: true,
      wins: true,
      losses: true,
      totalMatches: true
    }
  });
}
```

#### 2. Criar Endpoint tRPC
```javascript
// server/routers/elo.ts
import { router, publicProcedure } from '../trpc';
import { calculateELORating, getGlobalRankings } from '../services/eloService';

export const eloRouter = router({
  getRankings: publicProcedure.query(async () => {
    return getGlobalRankings();
  }),
  
  updateAfterMatch: publicProcedure
    .input(z.object({
      winnerId: z.string(),
      loserId: z.string()
    }))
    .mutation(async ({ input }) => {
      return calculateELORating(input.winnerId, input.loserId);
    })
});
```

#### 3. Criar Componente de Rankings
```javascript
// client/src/pages/Rankings.tsx
import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Rankings() {
  const { data: rankings, isLoading } = trpc.elo.getRankings.useQuery();
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Ranking Global</h1>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={rankings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentElo" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      
      <table className="w-full mt-6">
        <thead>
          <tr className="border-b">
            <th>Posição</th>
            <th>Nome</th>
            <th>ELO</th>
            <th>Vitórias</th>
            <th>Derrotas</th>
            <th>Taxa de Vitória</th>
          </tr>
        </thead>
        <tbody>
          {rankings?.map((worker, idx) => (
            <tr key={worker.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{worker.name}</td>
              <td className="p-2 font-bold">{worker.currentElo}</td>
              <td className="p-2">{worker.wins}</td>
              <td className="p-2">{worker.losses}</td>
              <td className="p-2">
                {worker.totalMatches > 0 
                  ? ((worker.wins / worker.totalMatches) * 100).toFixed(1) + '%'
                  : 'N/A'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🚀 Semana 2: Funcionalidades

### Dia 8-10: Sistema de Torneios

#### 1. Criar Schema de Torneios
```javascript
// prisma/schema.prisma (adicionar)
model Tournament {
  id          String   @id @default(cuid())
  name        String
  format      String   @default("single-elimination") // single-elimination, round-robin
  promotion   Promotion @relation(fields: [promotionId], references: [id])
  promotionId String
  
  participants TournamentParticipant[]
  matches     TournamentMatch[]
  
  status      String   @default("pending") // pending, in-progress, completed
  winner      Worker?  @relation("tournamentWinner", fields: [winnerId], references: [id])
  winnerId    String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TournamentParticipant {
  id          String   @id @default(cuid())
  tournament  Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  tournamentId String
  worker      Worker   @relation(fields: [workerId], references: [id])
  workerId    String
  
  @@unique([tournamentId, workerId])
}

model TournamentMatch {
  id          String   @id @default(cuid())
  tournament  Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  tournamentId String
  
  round       Int
  match       Int
  
  participant1 Worker  @relation("match_p1", fields: [participant1Id], references: [id])
  participant1Id String
  participant2 Worker  @relation("match_p2", fields: [participant2Id], references: [id])
  participant2Id String
  
  winner      Worker? @relation("match_winner", fields: [winnerId], references: [id])
  winnerId    String?
  
  quality     Int     @default(0)
  status      String  @default("pending") // pending, completed
  
  createdAt   DateTime @default(now())
}
```

#### 2. Criar Serviço de Torneios
```javascript
// src/services/tournamentService.js
export async function createTournament(name, format, promotionId, participantIds) {
  const tournament = await prisma.tournament.create({
    data: {
      name,
      format,
      promotionId,
      participants: {
        createMany: {
          data: participantIds.map(id => ({ workerId: id }))
        }
      }
    }
  });
  
  // Gerar matches
  if (format === 'single-elimination') {
    await generateSingleEliminationBracket(tournament.id, participantIds);
  }
  
  return tournament;
}

async function generateSingleEliminationBracket(tournamentId, participantIds) {
  const shuffled = participantIds.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < shuffled.length; i += 2) {
    await prisma.tournamentMatch.create({
      data: {
        tournamentId,
        round: 1,
        match: Math.floor(i / 2) + 1,
        participant1Id: shuffled[i],
        participant2Id: shuffled[i + 1],
        status: 'pending'
      }
    });
  }
}

export async function simulateTournament(tournamentId) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { matches: true }
  });
  
  const pendingMatches = tournament.matches.filter(m => m.status === 'pending');
  
  for (const match of pendingMatches) {
    // Simular resultado
    const winner = Math.random() > 0.5 ? match.participant1Id : match.participant2Id;
    const quality = Math.floor(Math.random() * 10) + 1;
    
    await prisma.tournamentMatch.update({
      where: { id: match.id },
      data: {
        winnerId: winner,
        quality,
        status: 'completed'
      }
    });
    
    // Atualizar ELO
    await calculateELORating(
      winner,
      winner === match.participant1Id ? match.participant2Id : match.participant1Id
    );
  }
  
  // Verificar se torneio terminou
  const allMatches = await prisma.tournamentMatch.findMany({
    where: { tournamentId }
  });
  
  if (allMatches.every(m => m.status === 'completed')) {
    const finalMatch = allMatches[allMatches.length - 1];
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: 'completed',
        winnerId: finalMatch.winnerId
      }
    });
  }
}
```

#### 3. Criar UI de Torneios
```javascript
// client/src/pages/Tournaments.tsx
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Tournaments() {
  const { data: tournaments } = trpc.tournament.list.useQuery();
  const createMutation = trpc.tournament.create.useMutation();
  const simulateMutation = trpc.tournament.simulate.useMutation();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Torneios</h1>
      
      <Button onClick={() => createMutation.mutate({
        name: 'Novo Torneio',
        format: 'single-elimination',
        participants: []
      })}>
        Criar Torneio
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {tournaments?.map(tournament => (
          <Card key={tournament.id} className="p-4">
            <h2 className="text-xl font-bold">{tournament.name}</h2>
            <p className="text-sm text-gray-600">{tournament.format}</p>
            <p className="text-sm mt-2">Status: {tournament.status}</p>
            
            <Button 
              className="mt-4"
              onClick={() => simulateMutation.mutate({ tournamentId: tournament.id })}
              disabled={tournament.status !== 'pending'}
            >
              Simular
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

### Dia 11-14: Testes Automatizados

#### 1. Configurar Vitest
```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});
```

#### 2. Escrever Testes
```javascript
// src/services/__tests__/eloService.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateELORating } from '../eloService';

describe('ELO Rating System', () => {
  beforeEach(async () => {
    // Setup database
  });
  
  it('should increase winner ELO', async () => {
    const result = await calculateELORating('winner-id', 'loser-id');
    expect(result.newWinnerElo).toBeGreaterThan(1600);
  });
  
  it('should decrease loser ELO', async () => {
    const result = await calculateELORating('winner-id', 'loser-id');
    expect(result.newLoserElo).toBeLessThan(1600);
  });
  
  it('should handle upsets correctly', async () => {
    // Underdog vence favorito
    const result = await calculateELORating('underdog-id', 'favorite-id');
    expect(result.newWinnerElo - 1600).toBeGreaterThan(
      1600 - result.newLoserElo
    );
  });
});
```

```bash
# Executar testes
npm run test

# Com cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📊 Checklist de Implementação

### Semana 1
- [ ] Docker Compose setup
- [ ] Dependências instaladas
- [ ] Prisma configurado
- [ ] PostgreSQL migrado
- [ ] Sistema ELO implementado
- [ ] Ranking page criada

### Semana 2
- [ ] Schema de torneios
- [ ] Serviço de torneios
- [ ] UI de torneios
- [ ] Testes básicos
- [ ] Testes de ELO
- [ ] Testes de torneios

---

## 🎯 Próximos Passos

Após completar estas 2 semanas, você terá:

✅ Infraestrutura escalável (PostgreSQL + Redis)  
✅ Sistema competitivo (ELO + Rankings)  
✅ Torneios funcionais  
✅ Testes automatizados  
✅ Base sólida para expansão  

**Próximas prioridades:**
1. Ligas sazonais
2. Análise avançada
3. UI redesign
4. Integração Discord
5. Microserviços

---

*Quick Start Guide - Pro Wrestling Sim v5.0.0*  
*Gerado em: May 3, 2026*
