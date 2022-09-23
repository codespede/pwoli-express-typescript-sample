'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    //console.log('QI', await queryInterface.sequelize.sync());
    let events = [];
    for (let i = 0; i < 10; i++)
      events.push({
        title: `Event - ${i + 1}`,
      })
    let insertedEvents = await queryInterface.bulkInsert('event', events, { returning: ['id'] });
    const dbEvents = await queryInterface.sequelize.query(
      `SELECT id from Event;`
    );
    let eventId = dbEvents[0][Math.floor(Math.random() * dbEvents[0].length) + 1].id
    let companies = [];
    for (let i = 0; i < 100; i++){
      companies.push({
        title: `Company - ${i + 1}`,
        description: `Company = ${i + 1} description`,
        email: `email@company${i + 1}.com`,
        eventId: eventId !== undefined ? eventId : 1
      })
    }
    let insertedCompanies = await queryInterface.bulkInsert('company', companies, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('event', null, {});
    await queryInterface.bulkDelete('company', null, {});
  }
};
