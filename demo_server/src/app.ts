/**
 * Test
 */
import { Application, Bootstrap } from '@whale/core';

@Bootstrap({
    base: __dirname,
    static: '../demo_web/dist',
    config: 'configs',
    modules: 'modules'
})
class App extends Application {}
