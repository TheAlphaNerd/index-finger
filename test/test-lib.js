/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var os = require('os');
var path = require('path');
var fs = require('fs');

var indexFinger = require('../lib');
var test = require('tape');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var tempdir = os.tmpdir();

var source = path.join(__dirname, 'fixtures', 'example');
var outPath = path.join(tempdir, 'index-finger');

var expectedIndexPath = path.join(__dirname, 'fixtures', 'lib', 'expected-index.js');
var expectedIndex = fs.readFileSync(expectedIndexPath, 'utf8');

var expectedCorePath = path.join(__dirname, 'fixtures', 'lib', 'expected-core.js');
var expectedCore = fs.readFileSync(expectedCorePath, 'utf8');

var expectedPhysicsPath = path.join(__dirname, 'fixtures', 'lib', 'expected-physics.js');
var expectedPhysics = fs.readFileSync(expectedPhysicsPath, 'utf8');

var expectedForcesPath = path.join(__dirname, 'fixtures', 'lib', 'expected-forces.js');
var expectedForces = fs.readFileSync(expectedForcesPath, 'utf8');

test('index-finger: setup', function (t) {
  t.plan(2);
  mkdirp(outPath, function (err) {
    t.notok(err, 'folder should be made without an error');
    t.ok(fs.existsSync(outPath), 'folder should exists');
  });
});

test('index-finger: can load', function (t) {
  t.plan(1);
  t.ok(indexFinger, 'it should be requireable');
});

test('index-finger: works as expected', function (t) {
  t.plan(5);
  indexFinger(source, outPath, function (err) {
    t.notok(err, 'should exit without an error');
    t.equal(fs.readFileSync(path.join(outPath, 'index.js'), 'utf8'), expectedIndex, 'the generated index should have the expected content');
    t.equal(fs.readFileSync(path.join(outPath, 'core', 'index.js'), 'utf8'), expectedCore, 'the generated index in the core directory should have the expected content');
    t.equal(fs.readFileSync(path.join(outPath, 'physics', 'index.js'), 'utf8'), expectedPhysics, 'the generated index in the physics directory should have the expected content');
    t.equal(fs.readFileSync(path.join(outPath, 'physics', 'forces', 'index.js'), 'utf8'), expectedForces, 'the generated index in the physics/forces directory should have the expected content');
  });
});

test('index-finger: teardown', function (t) {
  t.plan(2);
  rimraf(outPath, function (err) {
    t.notok(err, 'folder should be removed without an error');
    t.notok(fs.existsSync(outPath), 'folder should no longer exist');
  });
});
