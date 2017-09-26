import {suite, test} from 'mocha-typescript';
import {Server} from "http";
import * as chai from 'chai';

const expect = chai.expect;

import app from '../../src/App';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

@suite class API {
    private static port: number = 3000;
    private static host: string = 'http://localhost';
    private static connection: string;
    private static server: Server;

    public static before(done: MochaDone) {
        this.connection = this.host + ":" + this.port;
        this.server = app.listen(this.port, done);
    }

    public static after() {
        this.server.close();
    }

    @test("responds with status 200")
    public status200(done: MochaDone) {
        chai.request(API.connection)
            .get('/api')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('API is running');
                done();
            });
    }

    @test("responds to POST with status 415")
    public status415(done: MochaDone) {
        chai.request(API.connection)
            .post('/api')
            .end(function (err, res) {
                expect(res).to.have.status(415);
                done();
            });
    }

    @test("responds to JSON POST with status 404")
    public status420(done: MochaDone) {
        chai.request(API.connection)
            .post('/api')
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done();
            });
    }

}