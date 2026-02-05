export async function seedDatabase(db) {
  try {
    // Inserir Promoções
    const promotions = [
      {
        name: 'World Wrestling Entertainment',
        acronym: 'WWE',
        country: 'USA',
        prestige: 95,
        money: 5000000,
        popularity_na: 98,
        popularity_sa: 85,
        popularity_asia: 75,
        popularity_oceania: 80,
        popularity_africa: 60,
        popularity_europe: 90,
      },
      {
        name: 'All Elite Wrestling',
        acronym: 'AEW',
        country: 'USA',
        prestige: 85,
        money: 2000000,
        popularity_na: 80,
        popularity_sa: 65,
        popularity_asia: 70,
        popularity_oceania: 70,
        popularity_africa: 50,
        popularity_europe: 75,
      },
      {
        name: 'New Japan Pro Wrestling',
        acronym: 'NJPW',
        country: 'Japan',
        prestige: 90,
        money: 1500000,
        popularity_na: 70,
        popularity_sa: 50,
        popularity_asia: 95,
        popularity_oceania: 75,
        popularity_africa: 40,
        popularity_europe: 65,
      },
      {
        name: 'Impact Wrestling',
        acronym: 'IMPACT',
        country: 'USA',
        prestige: 70,
        money: 800000,
        popularity_na: 60,
        popularity_sa: 45,
        popularity_asia: 50,
        popularity_oceania: 55,
        popularity_africa: 35,
        popularity_europe: 50,
      },
      {
        name: 'Ring of Honor',
        acronym: 'ROH',
        country: 'USA',
        prestige: 75,
        money: 1000000,
        popularity_na: 65,
        popularity_sa: 50,
        popularity_asia: 60,
        popularity_oceania: 60,
        popularity_africa: 40,
        popularity_europe: 55,
      },
    ];

    const insertPromotion = db.prepare(`
      INSERT INTO promotions (name, acronym, country, prestige, money, popularity_na, popularity_sa, popularity_asia, popularity_oceania, popularity_africa, popularity_europe)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const promotionIds = {};
    promotions.forEach((promo) => {
      const result = insertPromotion.run(
        promo.name,
        promo.acronym,
        promo.country,
        promo.prestige,
        promo.money,
        promo.popularity_na,
        promo.popularity_sa,
        promo.popularity_asia,
        promo.popularity_oceania,
        promo.popularity_africa,
        promo.popularity_europe
      );
      promotionIds[promo.acronym] = result.lastInsertRowid;
    });

    // Inserir Lutadores
    const workers = [
      // WWE
      { name: 'John Cena', promo: 'WWE', skill: 85, entertainment: 92, star: 98, intimidation: 80, sex: 85, psychology: 85, safety: 95, stamina: 90 },
      { name: 'The Rock', promo: 'WWE', skill: 88, entertainment: 95, star: 99, intimidation: 92, sex: 90, psychology: 90, safety: 92, stamina: 88 },
      { name: 'Roman Reigns', promo: 'WWE', skill: 82, entertainment: 85, star: 90, intimidation: 95, sex: 88, psychology: 82, safety: 90, stamina: 92 },
      { name: 'Seth Rollins', promo: 'WWE', skill: 90, entertainment: 88, star: 85, intimidation: 80, sex: 82, psychology: 88, safety: 88, stamina: 90 },
      { name: 'The Undertaker', promo: 'WWE', skill: 88, entertainment: 90, star: 95, intimidation: 98, sex: 75, psychology: 92, safety: 95, stamina: 85 },
      { name: 'Hulk Hogan', promo: 'WWE', skill: 75, entertainment: 92, star: 98, intimidation: 85, sex: 88, psychology: 80, safety: 85, stamina: 75 },
      { name: 'Shawn Michaels', promo: 'WWE', skill: 95, entertainment: 92, star: 92, intimidation: 70, sex: 85, psychology: 95, safety: 95, stamina: 85 },
      { name: 'Stone Cold Steve Austin', promo: 'WWE', skill: 85, entertainment: 95, star: 98, intimidation: 90, sex: 82, psychology: 88, safety: 88, stamina: 88 },
      // AEW
      { name: 'Kenny Omega', promo: 'AEW', skill: 95, entertainment: 88, star: 88, intimidation: 75, sex: 80, psychology: 95, safety: 92, stamina: 90 },
      { name: 'Chris Jericho', promo: 'AEW', skill: 92, entertainment: 95, star: 90, intimidation: 80, sex: 85, psychology: 95, safety: 95, stamina: 85 },
      { name: 'Jon Moxley', promo: 'AEW', skill: 88, entertainment: 82, star: 85, intimidation: 92, sex: 80, psychology: 85, safety: 88, stamina: 90 },
      { name: 'MJF', promo: 'AEW', skill: 85, entertainment: 90, star: 85, intimidation: 78, sex: 88, psychology: 85, safety: 88, stamina: 88 },
      // NJPW
      { name: 'Kazuchika Okada', promo: 'NJPW', skill: 95, entertainment: 85, star: 90, intimidation: 80, sex: 75, psychology: 95, safety: 95, stamina: 90 },
      { name: 'Hiroshi Tanahashi', promo: 'NJPW', skill: 92, entertainment: 90, star: 88, intimidation: 75, sex: 82, psychology: 90, safety: 92, stamina: 88 },
      { name: 'Shinsuke Nakamura', promo: 'NJPW', skill: 90, entertainment: 88, star: 85, intimidation: 85, sex: 90, psychology: 88, safety: 90, stamina: 88 },
      // IMPACT
      { name: 'AJ Styles', promo: 'IMPACT', skill: 92, entertainment: 85, star: 85, intimidation: 75, sex: 80, psychology: 88, safety: 92, stamina: 90 },
      // ROH
      { name: 'Adam Cole', promo: 'ROH', skill: 88, entertainment: 85, star: 82, intimidation: 75, sex: 82, psychology: 85, safety: 88, stamina: 88 },
      { name: 'Kyle O\'Reilly', promo: 'ROH', skill: 90, entertainment: 80, star: 80, intimidation: 78, sex: 78, psychology: 90, safety: 90, stamina: 88 },
    ];

    const insertWorker = db.prepare(`
      INSERT INTO workers (name, promotion_id, wrestling_skill, entertainment, star_power, intimidation, sex_appeal, psychology, safety, stamina)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const workerIds = {};
    workers.forEach((worker) => {
      const result = insertWorker.run(
        worker.name,
        promotionIds[worker.promo],
        worker.skill,
        worker.entertainment,
        worker.star,
        worker.intimidation,
        worker.sex,
        worker.psychology,
        worker.safety,
        worker.stamina
      );
      workerIds[worker.name] = result.lastInsertRowid;
    });

    // Inserir Títulos
    const titles = [
      { name: 'WWE Championship', promo: 'WWE', prestige: 99, type: 'singles' },
      { name: 'WWE Universal Championship', promo: 'WWE', prestige: 98, type: 'singles' },
      { name: 'WWE Intercontinental Championship', promo: 'WWE', prestige: 85, type: 'singles' },
      { name: 'AEW World Championship', promo: 'AEW', prestige: 95, type: 'singles' },
      { name: 'AEW International Championship', promo: 'AEW', prestige: 80, type: 'singles' },
      { name: 'NJPW IWGP Heavyweight Championship', promo: 'NJPW', prestige: 98, type: 'singles' },
      { name: 'NJPW IWGP Intercontinental Championship', promo: 'NJPW', prestige: 85, type: 'singles' },
      { name: 'IMPACT World Championship', promo: 'IMPACT', prestige: 80, type: 'singles' },
      { name: 'ROH World Championship', promo: 'ROH', prestige: 85, type: 'singles' },
      { name: 'ROH Television Championship', promo: 'ROH', prestige: 70, type: 'singles' },
    ];

    const insertTitle = db.prepare(`
      INSERT INTO titles (name, promotion_id, prestige, type)
      VALUES (?, ?, ?, ?)
    `);

    titles.forEach((title) => {
      insertTitle.run(
        title.name,
        promotionIds[title.promo],
        title.prestige,
        title.type
      );
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
