/**
 * Test
 */
import { Application, Bootstrap } from '@whale/core';

@Bootstrap({
    base: __dirname,
    static: '../cas_uras/dest',
    config: 'configs',
    modules: 'modules',
})
class App extends Application {}
