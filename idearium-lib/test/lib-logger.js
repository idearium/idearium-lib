'use strict';

const path = require('path');
const fs = require('fs');
const mitm = require('mitm');
const { stderr } = require('test-console');
const logs = require('../lib/logs');
const dir = path.resolve(__dirname, '..', 'logs');
const rimraf = require('rimraf');

describe('class logs.Logger', () => {

    beforeAll((done) => {

        // Create the directory for the logger
        rimraf('../logs', () => {

            if (fs.existsSync(dir)) {
                return done();
            }

            return fs.mkdir(dir, done);

        });

    });

    describe('instantiation', () => {

        it('can be instantiated', () => {

            expect(new logs.Logger({
                context: 'context',
                name: 'name',
            })).not.toThrow();

        });

        describe('will throw if', () => {

            it('name parameter is not provided', () => {

                try {

                    new logs.Logger();

                } catch (err) {

                    expect(err.message).toMatch(/name/);

                }

            });

            it('context parameter is not provided', () => {

                try {

                    new logs.Logger({ name: 'test' });

                } catch (err) {

                    expect(err.message).toMatch(/context/);

                }

            });

            it('level is wrong', () => {

                try {

                    new logs.Logger({
                        context: 'context',
                        level: 'warning',
                        name: 'name',
                    });

                } catch (err) {

                    expect(err.message).toMatch(/level/);

                }

            });

            it('remote specified, without token parameter', () => {

                try {

                    new logs.Logger({
                        context: 'context',
                        name: 'name',
                        remote: true,
                    });

                } catch (err) {

                    expect(err.message).toMatch(/token/);

                }

            });

        });

    });

    describe('file stream', () => {

        // Empty the file after each test.
        afterEach((done) => {
            fs.truncate(path.join(dir, 'application.log'), done);
        });

        it('will write to file', (done) => {

            // Create the logger.
            const logger = new logs.Logger({
                name: 'application',
                context: 'write-to-file-test'
            });

            // Write content to the log.
            logger.error('Testing write to file');

            // Verify the log exists.
            fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                // Handle any errors
                if (err) {
                    return done(err);
                }

                // Check out results.
                expect(content).toMatch(/Testing write to file/);
                expect(content).toMatch(/write-to-file/);

                return done();

            });

        });

        describe('at levels', () => {

            let logger;

            beforeAll(() => {

                // Init the logger.
                logger = new logs.Logger({
                    name: 'application',
                    context: 'at-levels-test',
                    level: 'trace'
                });

            });

            it('trace', (done) => {

                logger.trace('Logging at trace level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at trace level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":10/);

                    return done();

                });

            });

            it('debug', (done) => {

                logger.debug('Logging at debug level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at debug level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":20/);

                    return done();

                });

            });

            it('info', (done) => {

                logger.info('Logging at info level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at info level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":30/);

                    return done();

                });

            });

            it('warn', (done) => {

                logger.warn('Logging at warn level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at warn level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":40/);

                    return done();

                });

            });

            it('error', (done) => {

                logger.error('Logging at error level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at error level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":50/);

                    return done();

                });

            });

            it('fatal', (done) => {

                logger.fatal('Logging at fatal level');

                // Verify the log exists.
                fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                    // Handle any errors
                    if (err) {
                        return done(err);
                    }

                    // Check out results.
                    expect(content).toMatch(/Logging at fatal level/);
                    expect(content).toMatch(/at-levels-test/);
                    expect(content).toMatch(/"level":60/);

                    return done();

                });

            });

        });

    });

    describe('stderr stream', () => {

        it('will write to stderr', (done) => {

            // Create the logger.
            const logger = new logs.Logger({
                name: 'application',
                context: 'lib:logger:write-to-stderr-test',
                local: false,
                stdErr: true
            });

            // Write content to the log.
            const output = stderr.inspectSync(() => {
                logger.error('Testing write to stderr');
            });

            expect(Array.isArray(output)).toBe(true);
            expect(output).toHaveLength(1);
            expect(output[0]).toMatch(/lib:logger:write-to-stderr-test/);
            expect(output[0]).toMatch(/"name":"application"/);
            expect(output[0]).toMatch(/Testing write to stderr/);

            return done();

        });

        describe('at levels', () => {

            let logger;

            beforeAll(() => {

                // Init the logger.
                logger = new logs.Logger({
                    name: 'application',
                    context: 'lib:logger:stderr-at-levels-test',
                    level: 'trace',
                    local: false,
                    stdErr: true
                });

            });

            it('trace', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.trace('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":10/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

            it('debug', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.debug('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":20/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

            it('info', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.info('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":30/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

            it('warn', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.warn('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":40/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

            it('error', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.error('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":50/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

            it('fatal', (done) => {

                // Write content to the log.
                const output = stderr.inspectSync(() => {
                    logger.fatal('Testing write to stderr');
                });

                expect(Array.isArray(output)).toBe(true);
                expect(output).toHaveLength(1);
                expect(output[0]).toMatch(/lib:logger:stderr-at-levels-test/);
                expect(output[0]).toMatch(/"name":"application"/);
                expect(output[0]).toMatch(/"level":60/);
                expect(output[0]).toMatch(/Testing write to stderr/);

                return done();

            });

        });

    });

    describe('remote stream', () => {

        let mock;

        beforeEach(() => {
            mock = mitm();
        });

        afterEach(() => {
            mock.disable();
        });

        it('will write to log entries', (done) => {

            // Create the logger.
            const logger = new logs.Logger({
                    name: 'application',
                    context: 'lib:logger:write-to-remote-test',
                    local: false,
                    stdErr: false,
                    remote: true,
                    token: '00000000-0000-0000-0000-000000000000'
                });

            mock.on('connection', function (socket, opts) {
                socket.on('data', function (buffer) {

                    var msg = buffer.toString();

                    // Check out results.
                    expect(msg).toMatch(/Testing write to remote/);
                    expect(msg).toMatch(/lib:logger:write-to-remote-test/);
                    expect(msg).toMatch(/"level":50/);

                    return done();

                });
            });

            // Write content to the log.
            logger.error('Testing write to remote');

        });

        describe('at levels', () => {

            let logger;

            beforeEach(() => {

                // Create the logger.
                logger = new logs.Logger({
                    name: 'application',
                    context: 'lib:logger:write-to-remote-at-levels-test',
                    level: 'trace',
                    local: false,
                    stdErr: false,
                    remote: true,
                    token: '00000000-0000-0000-0000-000000000000'
                });

            });

            it('trace', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":10/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.trace('Testing write to remote at levels');

            });

            it('debug', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":20/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.debug('Testing write to remote at levels');

            });

            it('info', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":30/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.info('Testing write to remote at levels');

            });

            it('warn', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":40/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.warn('Testing write to remote at levels');

            });

            it('error', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":50/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.error('Testing write to remote at levels');

            });

            it('fatal', (done) => {

                mock.on('connection', function (socket, opts) {
                    socket.on('data', function (buffer) {

                        var msg = buffer.toString();

                        // Check out results.
                        expect(msg).toMatch(/Testing write to remote at levels/);
                        expect(msg).toMatch(/lib:logger:write-to-remote-at-levels-test/);
                        expect(msg).toMatch(/"level":60/);

                        return done();

                    });
                });

                // Write content to the log.
                logger.fatal('Testing write to remote at levels');

            });

        });

    });

    describe('custom stream', () => {

        it('will write to a custom stream', (done) => {

            // Basic es6 class to act as a Bunyan stream.
            const CustomStream = class {

                constructor () {

                    return {
                        name: 'application',
                        level: 'trace',
                        type: 'raw',
                        stream: this
                    }

                }

                write (rec) {

                    expect(rec.name).toBe('application');
                    expect(rec.context).toBe('lib:logger:custom-stream');
                    expect(rec.msg).toBe('Testing custom stream');

                    return done();

                }

            };

            const logger = new logs.Logger({
                name: 'application',
                context: 'lib:logger:custom-stream',
                level: 'trace',
                local: false,
                stdErr: false,
                remote: false,
                streams: [new CustomStream()]
            });

            logger.info('Testing custom stream');

        });

    });

    describe('file, stderr, remote and custom stream', () => {

        let CustomStream;
        let logger;
        let output;
        let mock;
        let msg;
        let rec;

        beforeAll(() => {

            // Init the stream class.
            // Basic es6 class to act as a Bunyan stream.
            CustomStream = class {

                constructor () {

                    return {
                        name: 'application',
                        level: 'trace',
                        type: 'raw',
                        stream: this
                    }

                }

                write (_rec) {
                    rec = _rec;
                }

            };

            // Init the logger.
            logger = new logs.Logger({
                name: 'application',
                context: 'lib:logger:file-and-stderr-and-remote-test',
                level: 'trace',
                local: true,
                stdErr: true,
                remote: true,
                token: '00000000-0000-0000-0000-000000000000',
                streams: [new CustomStream()]
            });

            // Catch the HTTP requests.
            mock = mitm();

            mock.on('connection', function (socket, opts) {
                socket.on('data', function (buffer) {
                    msg = buffer.toString();
                    mock.disable();
                });
            });

            // Write content to the log.
            output = stderr.inspectSync(() => {
                logger.info('This is a combined output test');
            });

        });

        it('will output to file stream', (done) => {

            // Verify the log exists.
            fs.readFile(path.join(dir, 'application.log'), 'utf8', function (err, content) {

                // Handle any errors
                if (err) {
                    return done(err);
                }

                // Check out results.
                expect(content).toMatch(/This is a combined output test/);
                expect(content).toMatch(/lib:logger:file-and-stderr-and-remote-test/);
                expect(content).toMatch(/"level":30/);

                return done();

            });

        });

        it('will output to stderr stream', () => {

            expect(Array.isArray(output)).toBe(true);
            expect(output).toHaveLength(1);
            expect(output[0]).toMatch(/lib:logger:file-and-stderr-and-remote-test/);
            expect(output[0]).toMatch(/"name":"application"/);
            expect(output[0]).toMatch(/"level":30/);
            expect(output[0]).toMatch(/This is a combined output test/);

        });

        it('will send to remote logging platform', (done) => {

            var _done = false;

            setInterval(() => {

                // Wait until msg has been defined.
                if (msg && !_done) {

                    // Check out results.
                    expect(msg).toMatch(/This is a combined output test/);
                    expect(msg).toMatch(/lib:logger:file-and-stderr-and-remote-test/);
                    expect(msg).toMatch(/"name":"application"/);
                    expect(msg).toMatch(/"level":30/);

                    _done = true;

                    return done();

                }

            }, 100);

        });

        it('will log via custom stream', (done) => {

            var _done = false;

            setInterval(() => {

                // Wait until msg has been defined.
                if (rec && !_done) {

                    // Check out results.
                    expect(rec.msg).toBe('This is a combined output test');
                    expect(rec.context).toBe('lib:logger:file-and-stderr-and-remote-test');
                    expect(rec.name).toBe('application');
                    expect(rec.level).toBe(30);

                    _done = true;

                    return done();

                }

            }, 100);

        });

    });

    afterAll((done) => {
        rimraf('../logs', done);
    });

});
