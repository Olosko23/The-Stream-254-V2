const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

describe("User Controller Tests", () => {
  describe("POST api/v1/register", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/api/v1/register")
        .send({
          username: "testuser",
          email: "test1@example.com",
          password: "Test123!",
        })
        .timeout(20000)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("token");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("username", "testuser");
          done();
        });
    });
  });
});
