let PostsProcess = require('../obj/src/container/PostsProcess').PostsProcess;

try {
    let proc = new PostsProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}
