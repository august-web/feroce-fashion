const { writeFileSync, mkdirSync } = require("fs");
function ensureDir(d) { try { mkdirSync(d, {recursive:true}); } catch(e){} }
function w(f,c) { writeFileSync(f,c); console.log("Wrote " + f); }
