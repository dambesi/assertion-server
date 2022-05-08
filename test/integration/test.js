/*
Typ "npm run test" in de terminal om de testen te laten uitvoeren. De uitslag van deze
wordt live in de terminaal getoond en in het bestand "report.log" opgeslagen.
*/

const chai = require('chai');
const chaiHttp = require('chai-http');
// const credentials = require('./credentials');
chai.should();
chai.use(chaiHttp);

const credentials = [
  {
    studentnumber: process.env.studentnumber,
    server: process.env.server,
    token: process.env.token,
  },
];
let newToken;

credentials.forEach((item) => {
  console.log(credentials);
  let date = new Date().toLocaleString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
  });
  describe(`Share a meal API of ${item.studentnumber} tested @ ${date}`, () => {
    describe.only('UC-101 login /api/auth/login', () => {
      it.only('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai
          .request(item.server)
          .post('/api/auth/login')
          .send({
            emailAdress: 'r.schellius@avans.nl',
            // passwoord ontbreekt
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-101-2 Niet valide emailadres', (done) => {
        chai
          .request(item.server)
          .post('/api/auth/login')
          .send({
            // niet valide email
            emailAdress: 'r.schelliusavans.nl',
            password: 'secret',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('error');
            done();
          });
      });
      it.only('TC-101-3 Niet valide wachtwoord', (done) => {
        chai
          .request(item.server)
          .post('/api/auth/login')
          .send({
            emailAdress: 'r.schellius@avans.nl',
            // secret
            password: 'secre',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('error');
            done();
          });
      });
      it.only('TC-101-4 Gebruiker bestaat niet', (done) => {
        chai
          .request(item.server)
          .post('/api/auth/login')
          .send({
            emailAdress: 'assertion.server@avans.nl',
            password: 'secret',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('error');
            done();
          });
      });
      it.only('TC-101-5 Gebruiker scuccesvol ingelogd', (done) => {
        chai
          .request(item.server)
          .post('/api/auth/login')
          .send({
            emailAdress: 'r.schellius@avans.nl',
            password: 'secret',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(201);
            let { result } = res.body;
            result.should.be.an('object');
            result.should.have
              .property('emailAdress')
              .that.equals('r.schellius@avans.nl');
            result.should.have.property('token');
            newToken = result.token;
            // console.log(token);
            done();
          });
      });
    });
    describe.skip('UC-201 registreren /api/user', () => {
      it.only('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai
          .request(item.server)
          .post('/api/user')
          .send({
            firstName: 'Assertion',
            lastName: 'Server',
            // street ontbreekt
            // street: 'Lovensdijkstraat 61',
            city: 'Breda',
            password: 'secret',
            emailAdress: 'assertion.server@avans.nl',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-201-2 Niet valide emailadres', (done) => {
        chai
          .request(item.server)
          .post('/api/user')
          .send({
            firstName: 'Assertion',
            lastName: 'Server',
            street: 'Lovensdijkstraat 61',
            city: 'Breda',
            password: 'secret',
            // emailAdress ontbreekt
            // emailAdress: 'assertion.server@avans.nl',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-201-3 Niet valide wachtwoord', (done) => {
        chai
          .request(item.server)
          .post('/api/user')
          .send({
            firstName: 'Assertion',
            lastName: 'Server',
            street: 'Lovensdijkstraat 61',
            city: 'Breda',
            // password ontbreekt
            // password: 'secret',
            emailAdress: 'assertion.server@avans.nl',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-201-4 Gebruiker bestaat al', (done) => {
        chai
          .request(item.server)
          .post('/api/user')
          .send({
            firstName: 'Davide',
            lastName: 'Ambesi',
            street: 'Lovensdijkstraat 61',
            city: 'Breda',
            password: 'secret',
            emailAdress: 'd.ambesi@avans.nl',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(409);
            res.body.should.have.property('message');
            done();
          });
      });
      it.skip('TC-201-5 Gebruiker scuccesvol geregistreerd', (done) => {
        chai
          .request(item.server)
          .post('/api/user')
          .send({
            firstName: 'Joh',
            lastName: 'De',
            street: 'Lovensdijkstraat 61',
            city: 'Breda',
            password: 'secret',
            emailAdress: `${item}@student.it`,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(201);
            res.body.should.have.property('result');
            let { result } = res.body;
            result.should.have.property('firstName');
            result.should.have.property('isActive').that.equals(true);
            done();
          });
      });
    });
    describe.skip('UC-202 overzicht van gebruikers /api/user', () => {
      it.skip('TC-202-1 Toon nul gebruikers', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf(0);
            done();
          });
      });
      it.skip('TC-202-2 Toon twee gebruikers', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf(2);
            done();
          });
      });
      it.skip('TC-202-3 Toon gebruikers met zoekterm op niet-bestaande naam', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf(0);
            done();
          });
      });
      it.skip('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld "actief"=false', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf.above(0);
            done();
          });
      });
      it.skip('TC-202-5 Toon gebruikers met gebruik van de zoekterm op het veld "actief"=true', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf.above(0);
            done();
          });
      });
      it.skip('TC-202-6 Toon gebruikers met zoekterm op bestaande naam', (done) => {
        chai
          .request(item.server)
          .get('/api/user')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.lengthOf.above(0);
            done();
          });
      });
    });
    describe.skip('UC-203 Gebruikersprofiel opvragen /api/user/profile', () => {
      it.only('TC-203-1 Ongeldig token', (done) => {
        chai
          .request(item.server)
          .get('/api/user/profile')
          .auth('fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-203-2 Valide token en gebruiker bestaat', (done) => {
        chai
          .request(item.server)
          .get('/api/user/profile')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            // console.log(res.body);
            res.status.should.equals(200);
            let { result } = res.body;
            // console.log(result);
            result.should.have.property('street');
            done();
          });
      });
    });
    describe.skip('UC-204 Details van gebruiker /api/user/:id', () => {
      it.only('TC-204-1 Ongeldig token', (done) => {
        chai
          .request(item.server)
          .get('/api/user/1')
          .auth('fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        chai
          .request(item.server)
          // user 9999 bestaat niet
          .get('/api/user/9909')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            // console.log(res.body);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-204-3 Gebruiker-ID bestaat', (done) => {
        chai
          .request(item.server)
          .get('/api/user/1')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            let { result } = res.body;
            // console.log(result);
            result.should.have.property('street');
            done();
          });
      });
    });
    describe.skip('UC-205 Gebruiker wijzigen /api/user/:id', () => {
      it.only('TC-205-1 Verplicht veld ontbreekt', (done) => {
        chai
          .request(item.server)
          .put('/api/user/0')
          .auth(item.token, { type: 'bearer' })
          .send({
            id: 0,
            // roles ontbreekt
            // roles: [],
            isActive: true,
            phoneNumber: '06 12425478',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-205-2 Niet valide postcode', (done) => {
        chai
          .request(item.server)
          .put('/api/user/0')
          .auth(item.token, { type: 'bearer' })
          .send({
            id: 0,
            roles: ['guest'],
            isActive: true,
            // street must be a string
            street: 11,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-205-3 Niet valide telefoonnummer', (done) => {
        chai
          .request(item.server)
          .put('/api/user/0')
          .auth(item.token, { type: 'bearer' })
          .send({
            id: 0,
            roles: ['guest'],
            isActive: true,
            // phoneNumber must be a string
            phoneNumber: 061234567,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-205-4 Gebruiker bestaat niet', (done) => {
        chai
          .request(item.server)
          // user 9999 bestaat niet
          .put('/api/user/9999')
          .auth(item.token, { type: 'bearer' })
          .send({
            id: 0,
            roles: ['guest'],
            isActive: true,
            phoneNumber: '061234567',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-205-5 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .put('/api/user/0')
          .auth('fake_token', { type: 'bearer' })
          .send({
            id: 0,
            roles: ['guest'],
            isActive: true,
            phoneNumber: '061234567',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
        chai
          .request(item.server)
          .put('/api/user/1')
          .auth(item.token, { type: 'bearer' })
          .send({
            id: 1,
            roles: ['editor', 'guest'],
            isActive: true,
            phoneNumber: '061234567',
          })
          .end((err, res) => {
            res.should.be.an('object');
            // console.log(res.body);
            res.status.should.equals(200);
            let { result } = res.body;
            result.should.have.property('id').that.equals(1);
            done();
          });
      });
    });
    describe.skip('UC-206 Gebruiker verwijderen /api/user/:id', () => {
      it.only('TC-206-1 Gebruiker bestaat niet', (done) => {
        chai
          .request(item.server)
          .delete('/api/user/999999')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message', 'User does not exist');
            done();
          });
      });
      it.only('TC-206-2 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .delete('/api/user/43')
          .auth('fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message', 'Unauthorized');
            done();
          });
      });
      it.only('TC-206-3 Actor is geen eigenaar', (done) => {
        chai
          .request(item.server)
          .delete('/api/user/0')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.skip('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
        chai
          .request(item.server)
          .delete('/api/user/:id')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.should.have.property('message');
            done();
          });
      });
    });
    describe.skip('UC-301 Maaltijd aanmaken /api/meal', () => {
      it.only('TC-301-1 Verplicht veld ontbreekt', (done) => {
        chai
          .request(item.server)
          .post('/api/meal')
          .auth(item.token, { type: 'bearer' })
          .send({
            name: 'Spaghetti Bolognese',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            // isToTakeHome ontbreekt
            // isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-301-2 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .post('/api/meal')
          .auth('Fake_token', { type: 'bearer' })
          .send({
            name: 'Spaghetti Bolognese',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
        chai
          .request(item.server)
          .post('/api/meal')
          .auth(item.token, { type: 'bearer' })
          .send({
            name: 'Spaghetti Bologna',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(201);
            res.body.should.have.property('result');
            done();
          });
      });
    });
    describe.skip('UC-302 Maaltijd wijzigen /api/meal/:id', () => {
      it.only('TC-302-1 Verplicht veld ontbreekt', (done) => {
        chai
          .request(item.server)
          .put('/api/meal/1')
          .auth(item.token, { type: 'bearer' })
          .send({
            // name mag niet leeg zijn
            name: '',
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-302-2 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .put('/api/meal/1')
          .auth('Fake_token', { type: 'bearer' })
          .send({
            name: 'Spaghetti Bolognese',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-302-3 Niet eigenaar van de data', (done) => {
        chai
          .request(item.server)
          .put('/api/meal/2')
          .auth(item.token, { type: 'bearer' })
          .send({
            name: 'Spaghetti Bolognese',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-302-4 Maaltijd bestaat niet', (done) => {
        chai
          .request(item.server)
          .put('/api/meal/99999')
          .auth(item.token, { type: 'bearer' })
          .send({
            name: 'Spaghetti Bolognese',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-302-5 Maaltijd succesvol gewijzigd', (done) => {
        chai
          .request(item.server)
          .put('/api/meal/1')
          .auth(item.token, { type: 'bearer' })
          .send({
            name: 'Spaghetti Bologna',
            description: 'Dé pastaklassieker bij uitstek.',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: true,
            dateTime: '2022-04-29T13:02:04.476Z',
            imageUrl:
              'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            maxAmountOfParticipants: 6,
            price: 6.75,
          })
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result');
            done();
          });
      });
    });
    describe.skip('UC-303 Lijst van maaltijden opvragen /api/meal', () => {
      it.only('TC-303-1 Lijst van maaltijden geretourneerd', (done) => {
        chai
          .request(item.server)
          .get('/api/meal')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result').that.have.lengthOf.above(5);
            done();
          });
      });
    });
    describe.skip('UC-304 Details van een maaltijd opvragen /api/meal/:id', () => {
      it.only('TC-304-1 Maaltijden bestaan niet', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/99999')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-304-2 Details van maaltijd is geretourneerd', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/1')
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result');
            done();
          });
      });
    });
    describe.skip('UC-305 Maaltijd verwijderen /api/meal/:id', () => {
      it.only('TC-305-2 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .delete('/api/meal/1')
          .auth('Fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-305-3 Niet eigenaar van de data', (done) => {
        chai
          .request(item.server)
          .delete('/api/meal/2')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(400);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-305-4 Maaltijd bestaat niet', (done) => {
        chai
          .request(item.server)
          .delete('/api/meal/99999')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            res.body.should.have.property('message');
            done();
          });
      });
      it.skip('TC-305-5 Maaltijd succesvol gewijzigd', (done) => {
        chai
          .request(item.server)
          .delete('/api/meal/1')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result');
            done();
          });
      });
    });
    describe.skip('UC-401 Aanmelden voor maaltijd /api/meal/:id/participate', () => {
      it.only('TC-401-1 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/1/participate')
          .auth('Fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-401-2 Maaltijd bestaat niet', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/9999/participate')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-401-3 Succesvol aangemeld', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/1/participate')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result');
            done();
          });
      });
    });
    describe.skip('UC-402 Afmelden voor maaltijd /api/meal/:id/participate', () => {
      it.only('TC-402-1 Niet ingelogd', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/1/participate')
          .auth('Fake_token', { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(401);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-402-2 Maaltijd bestaat niet', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/9999/participate')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(404);
            res.body.should.have.property('message');
            done();
          });
      });
      it.only('TC-402-3 Succesvol afgemeld', (done) => {
        chai
          .request(item.server)
          .get('/api/meal/1/participate')
          .auth(item.token, { type: 'bearer' })
          .send()
          .end((err, res) => {
            res.should.be.an('object');
            res.status.should.equals(200);
            res.body.should.have.property('result');
            done();
          });
      });
    });
  });
});
