import { suite, test } from 'mocha-typescript';
import * as chai from 'chai';
const expect = chai.expect;

import * as auth from '../../src/middleware/auth';
import { createMocks, RequestOptions, ResponseOptions, Session, Mocks } from 'node-mocks-http';
import { EventEmitter } from "events";

interface UserSession extends Session {
    user: any;
}

@suite class AuthMiddlewareUnitTest {
    private createExpressMock(reqOptions: RequestOptions): Mocks {
        let resOptions:ResponseOptions = {
            eventEmitter: EventEmitter
        };

        return createMocks(reqOptions, resOptions);
    }

    @test("middleware exists")
    public middlewareExists() {
        expect(auth).to.be.a('object');
        expect(auth).to.respondTo('logger');
        expect(auth).to.respondTo('requireRole');
        expect(auth).to.respondTo('unauthorized');
        expect(auth.logger).to.be.a('function');
        expect(auth.requireRole).to.be.a('function');
        expect(auth.unauthorized).to.be.a('function');
    }

    @test('requireRole allows valid user session role')
    public requireRoleAllow(done:MochaDone) {
        let role:string = 'super-admin';

        let options:RequestOptions = {
            session: <UserSession>{ user: {
                role: role
            }}
        };

        let expressMock:Mocks = this.createExpressMock(options);

        auth.requireRole(role)(expressMock.req, expressMock.res, function() {
            expect(expressMock.res.finished).is.false;
            done();
        });
    }

    @test('requireRole denies invalid user session role')
    public requireRoleDeny(done:MochaDone) {
        let role:string = 'super-admin';

        let options:RequestOptions = {
            session: <UserSession>{ user: {
                role: 'user'
            }}
        };

        let expressMock:Mocks = this.createExpressMock(options);
        expressMock.res.on('end', function() {
            expect(expressMock.res.statusCode).to.equal(403);
            expect(expressMock.res._isJSON()).is.true;
            let responseJSON = JSON.parse(expressMock.res._getData());
            expect(responseJSON).has.property('errors');
            expect(responseJSON.errors).to.be.a('array');
            expect(responseJSON.errors).to.have.lengthOf(1);
            done();
        });

        auth.requireRole(role)(expressMock.req, expressMock.res);
    }
}