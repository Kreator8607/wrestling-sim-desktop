#!/usr/bin/env python3
"""
Pro Wrestling Sim - Criador de Assets
Cria diretório de assets e gera ícone profissional para Windows

Uso:
    python3 create-assets.py
    python3 create-assets.py --verbose
    python3 create-assets.py --size 512

Opções:
    --verbose       Modo verboso com mais detalhes
    --size SIZE     Tamanho do ícone (padrão: 256)
    --help          Mostra esta mensagem
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("⚠️  Pillow não instalado. Instalando...")
    os.system("pip3 install Pillow")
    from PIL import Image, ImageDraw, ImageFont


class AssetGenerator:
    """Gera assets para o aplicativo"""
    
    def __init__(self, project_root: str = ".", verbose: bool = False, icon_size: int = 256):
        self.project_root = Path(project_root)
        self.assets_dir = self.project_root / "assets"
        self.verbose = verbose
        self.icon_size = icon_size
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def log(self, message: str, level: str = "INFO", end: str = "\n"):
        """Log com cores"""
        colors = {
            "INFO": "\033[94m",      # Azul
            "SUCCESS": "\033[92m",   # Verde
            "WARNING": "\033[93m",   # Amarelo
            "ERROR": "\033[91m",     # Vermelho
            "RESET": "\033[0m"       # Reset
        }
        
        color = colors.get(level, colors["INFO"])
        reset = colors["RESET"]
        
        if self.verbose or level in ["ERROR", "WARNING", "SUCCESS"]:
            print(f"{color}[{level}] {message}{reset}", end=end)
    
    def create_assets_directory(self) -> bool:
        """Criar diretório de assets"""
        try:
            self.assets_dir.mkdir(parents=True, exist_ok=True)
            self.log(f"✅ Diretório criado: {self.assets_dir}", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Erro ao criar diretório: {e}", "ERROR")
            return False
    
    def create_icon_pil(self) -> bool:
        """Criar ícone usando PIL (Pillow)"""
        try:
            # Cores para o ícone
            bg_color = (20, 20, 30)      # Azul escuro
            accent_color = (255, 215, 0)  # Ouro
            text_color = (255, 255, 255)  # Branco
            
            # Criar imagem
            img = Image.new('RGB', (self.icon_size, self.icon_size), color=bg_color)
            draw = ImageDraw.Draw(img)
            
            # Desenhar fundo com gradiente (simulado com retângulos)
            for i in range(self.icon_size):
                shade = int(20 + (i / self.icon_size) * 20)
                draw.line([(0, i), (self.icon_size, i)], fill=(shade, shade, shade + 20))
            
            # Desenhar círculo central (anel)
            margin = self.icon_size // 8
            circle_bbox = [
                margin,
                margin,
                self.icon_size - margin,
                self.icon_size - margin
            ]
            draw.ellipse(circle_bbox, outline=accent_color, width=4)
            
            # Desenhar dois retângulos (representando lutadores)
            rect_width = self.icon_size // 6
            rect_height = self.icon_size // 3
            
            # Lutador 1 (esquerda)
            x1 = self.icon_size // 4 - rect_width // 2
            y1 = self.icon_size // 2 - rect_height // 2
            draw.rectangle(
                [x1, y1, x1 + rect_width, y1 + rect_height],
                fill=accent_color,
                outline=text_color,
                width=2
            )
            
            # Lutador 2 (direita)
            x2 = 3 * self.icon_size // 4 - rect_width // 2
            y2 = self.icon_size // 2 - rect_height // 2
            draw.rectangle(
                [x2, y2, x2 + rect_width, y2 + rect_height],
                fill=accent_color,
                outline=text_color,
                width=2
            )
            
            # Desenhar "VS" no meio
            try:
                # Tentar usar fonte padrão
                font_size = self.icon_size // 4
                # Usar fonte padrão do sistema
                draw.text(
                    (self.icon_size // 2 - font_size // 4, self.icon_size // 2 - font_size // 3),
                    "VS",
                    fill=text_color
                )
            except:
                # Se falhar, não desenhar texto
                pass
            
            # Salvar ícone
            icon_path = self.assets_dir / "icon.png"
            img.save(icon_path, "PNG")
            self.log(f"✅ Ícone criado: {icon_path} ({self.icon_size}x{self.icon_size})", "SUCCESS")
            
            return True
        except Exception as e:
            self.log(f"❌ Erro ao criar ícone com PIL: {e}", "ERROR")
            return False
    
    def create_icon_svg(self) -> bool:
        """Criar ícone em SVG (alternativa)"""
        try:
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{self.icon_size}" height="{self.icon_size}" viewBox="0 0 {self.icon_size} {self.icon_size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fundo -->
  <rect width="{self.icon_size}" height="{self.icon_size}" fill="#141e1e"/>
  
  <!-- Gradiente -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#141e1e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a2a2a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fundo com gradiente -->
  <rect width="{self.icon_size}" height="{self.icon_size}" fill="url(#grad)"/>
  
  <!-- Anel central -->
  <circle cx="{self.icon_size//2}" cy="{self.icon_size//2}" r="{self.icon_size//3}" 
          fill="none" stroke="#ffd700" stroke-width="4"/>
  
  <!-- Lutador 1 (esquerda) -->
  <rect x="{self.icon_size//4 - self.icon_size//12}" 
        y="{self.icon_size//2 - self.icon_size//6}" 
        width="{self.icon_size//6}" 
        height="{self.icon_size//3}" 
        fill="#ffd700" stroke="white" stroke-width="2"/>
  
  <!-- Lutador 2 (direita) -->
  <rect x="{3*self.icon_size//4 - self.icon_size//12}" 
        y="{self.icon_size//2 - self.icon_size//6}" 
        width="{self.icon_size//6}" 
        height="{self.icon_size//3}" 
        fill="#ffd700" stroke="white" stroke-width="2"/>
  
  <!-- Texto "VS" -->
  <text x="{self.icon_size//2}" y="{self.icon_size//2 + self.icon_size//8}" 
        font-size="{self.icon_size//4}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white" 
        font-family="Arial, sans-serif">VS</text>
  
  <!-- Texto "PWS" (rodapé) -->
  <text x="{self.icon_size//2}" y="{self.icon_size - self.icon_size//16}" 
        font-size="{self.icon_size//8}" 
        text-anchor="middle" 
        fill="#ffd700" 
        font-family="Arial, sans-serif">PWS</text>
</svg>'''
            
            svg_path = self.assets_dir / "icon.svg"
            with open(svg_path, 'w') as f:
                f.write(svg_content)
            
            self.log(f"✅ Ícone SVG criado: {svg_path}", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Erro ao criar SVG: {e}", "ERROR")
            return False
    
    def create_icon_ico(self) -> bool:
        """Converter PNG para ICO (Windows)"""
        try:
            png_path = self.assets_dir / "icon.png"
            ico_path = self.assets_dir / "icon.ico"
            
            if not png_path.exists():
                self.log(f"⚠️  PNG não encontrado, pulando ICO", "WARNING")
                return False
            
            # Abrir PNG e converter para ICO
            img = Image.open(png_path)
            
            # Criar múltiplos tamanhos para ICO (incluindo 256x256 como principal)
            sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
            img_resized = [img.resize(size, Image.Resampling.LANCZOS) for size in sizes]
            
            # Salvar como ICO com 256x256 como primeira imagem (principal)
            img_256 = img_resized[-1]  # 256x256 é o último
            img_256.save(ico_path, "ICO", sizes=sizes)
            
            self.log(f"✅ Ícone ICO criado: {ico_path} (múltiplos tamanhos, principal: 256x256)", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Erro ao criar ICO: {e}", "ERROR")
            return False
    
    def create_readme(self) -> bool:
        """Criar README para assets"""
        try:
            readme_content = """# Assets - Pro Wrestling Sim

## Arquivos

- `icon.png` - Ícone principal (256x256 PNG)
- `icon.ico` - Ícone Windows (múltiplos tamanhos)
- `icon.svg` - Ícone vetorial (escalável)

## Uso

### Electron (main.js)
```javascript
icon: path.join(__dirname, '../assets/icon.png')
```

### Windows Installer (NSIS)
```
!define MUI_ICON "assets\\icon.ico"
```

## Customização

Para customizar o ícone:

1. Editar `create-assets.py`
2. Modificar cores:
   - `bg_color` - Cor de fundo
   - `accent_color` - Cor de destaque
   - `text_color` - Cor do texto

3. Executar: `python3 create-assets.py`

## Requisitos

- Python 3.7+
- Pillow (PIL)

## Instalação de Dependências

```bash
pip3 install Pillow
```
"""
            
            readme_path = self.assets_dir / "README.md"
            with open(readme_path, 'w') as f:
                f.write(readme_content)
            
            self.log(f"✅ README criado: {readme_path}", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Erro ao criar README: {e}", "ERROR")
            return False
    
    def verify_assets(self) -> bool:
        """Verificar assets criados"""
        try:
            files_to_check = [
                "icon.png",
                "icon.svg",
                "icon.ico",
                "README.md"
            ]
            
            self.log("\n" + "=" * 60, "INFO")
            self.log("VERIFICAÇÃO DE ASSETS", "INFO")
            self.log("=" * 60, "INFO")
            
            all_exist = True
            for filename in files_to_check:
                filepath = self.assets_dir / filename
                exists = filepath.exists()
                status = "✅" if exists else "❌"
                
                if exists:
                    size = filepath.stat().st_size
                    self.log(f"{status} {filename} ({size} bytes)", "SUCCESS" if exists else "ERROR")
                else:
                    self.log(f"{status} {filename}", "ERROR")
                    all_exist = False
            
            self.log("=" * 60, "INFO")
            return all_exist
        except Exception as e:
            self.log(f"❌ Erro na verificação: {e}", "ERROR")
            return False
    
    def run(self) -> bool:
        """Executar geração de assets"""
        self.log("=" * 60, "INFO")
        self.log("PRO WRESTLING SIM - GERADOR DE ASSETS", "INFO")
        self.log("=" * 60, "INFO")
        self.log(f"Projeto: {self.project_root}", "INFO")
        self.log(f"Tamanho do ícone: {self.icon_size}x{self.icon_size}", "INFO")
        
        # Criar diretório
        if not self.create_assets_directory():
            return False
        
        # Criar ícone PNG
        if not self.create_icon_pil():
            self.log("⚠️  Falha ao criar ícone PNG", "WARNING")
        
        # Criar ícone SVG
        if not self.create_icon_svg():
            self.log("⚠️  Falha ao criar ícone SVG", "WARNING")
        
        # Criar ícone ICO
        if not self.create_icon_ico():
            self.log("⚠️  Falha ao criar ícone ICO", "WARNING")
        
        # Criar README
        if not self.create_readme():
            self.log("⚠️  Falha ao criar README", "WARNING")
        
        # Verificar assets
        self.log("")
        success = self.verify_assets()
        
        # Resumo
        self.log("\n" + "=" * 60, "INFO")
        if success:
            self.log("✅ TODOS OS ASSETS FORAM CRIADOS COM SUCESSO!", "SUCCESS")
            self.log("", "INFO")
            self.log("Próximos passos:", "INFO")
            self.log("  1. npm run dev", "INFO")
            self.log("  2. npm run build:win", "INFO")
        else:
            self.log("⚠️  Alguns assets falharam", "WARNING")
            self.log("Verifique os erros acima", "WARNING")
        self.log("=" * 60, "INFO")
        
        return success


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Gerador de Assets - Pro Wrestling Sim',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos de uso:
  python3 create-assets.py
  python3 create-assets.py --verbose
  python3 create-assets.py --size 512
  python3 create-assets.py --verbose --size 512
        """
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Modo verboso com mais detalhes'
    )
    parser.add_argument(
        '--size',
        type=int,
        default=256,
        help='Tamanho do ícone (padrão: 256)'
    )
    
    args = parser.parse_args()
    
    # Obter diretório do projeto
    project_root = Path(__file__).parent
    
    # Criar gerador
    generator = AssetGenerator(
        project_root=str(project_root),
        verbose=args.verbose,
        icon_size=args.size
    )
    
    # Executar
    success = generator.run()
    
    # Retornar código de saída
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
