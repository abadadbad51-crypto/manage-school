const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Base backgrounds - richer, darker, premium OLED feel
    content = content.replace(/dark:bg-slate-950/g, 'dark:bg-[#0a0a0b]');
    content = content.replace(/dark:bg-slate-900\/50/g, 'dark:bg-[#141415]/50');
    content = content.replace(/dark:bg-slate-900/g, 'dark:bg-[#141415]');
    content = content.replace(/dark:bg-slate-800\/50/g, 'dark:bg-[#202022]/50');
    content = content.replace(/dark:bg-slate-800\/30/g, 'dark:bg-[#202022]/30');
    content = content.replace(/dark:bg-slate-800/g, 'dark:bg-[#202022]');
    
    // Improved subtle borders
    content = content.replace(/dark:border-white\/20/g, 'dark:border-white/10');
    content = content.replace(/dark:border-slate-800/g, 'dark:border-white/5');
    content = content.replace(/dark:border-slate-700\/50/g, 'dark:border-white/5');
    content = content.replace(/dark:border-slate-700/g, 'dark:border-white/10');
    
    // Text refinement
    content = content.replace(/dark:text-slate-500/g, 'dark:text-zinc-500');
    content = content.replace(/dark:text-slate-400/g, 'dark:text-zinc-400');
    content = content.replace(/dark:text-slate-300/g, 'dark:text-zinc-300');
    content = content.replace(/dark:text-slate-200/g, 'dark:text-zinc-200');

    // Colored backgrounds fix dark modes
    content = content.replace(/dark:bg-blue-900\/20/g, 'dark:bg-blue-500/10');
    content = content.replace(/dark:bg-blue-900\/30/g, 'dark:bg-blue-500/15');
    content = content.replace(/dark:border-blue-800\/30/g, 'dark:border-blue-500/20');
    content = content.replace(/dark:border-blue-800/g, 'dark:border-blue-500/20');
    
    content = content.replace(/dark:bg-emerald-900\/20/g, 'dark:bg-emerald-500/10');
    content = content.replace(/dark:bg-emerald-900\/30/g, 'dark:bg-emerald-500/15');
    content = content.replace(/dark:border-emerald-800/g, 'dark:border-emerald-500/20');
    
    content = content.replace(/dark:bg-rose-900\/20/g, 'dark:bg-rose-500/10');
    content = content.replace(/dark:bg-rose-900\/30/g, 'dark:bg-rose-500/15');
    content = content.replace(/dark:border-rose-800/g, 'dark:border-rose-500/20');

    content = content.replace(/dark:bg-orange-900\/20/g, 'dark:bg-orange-500/10');
    content = content.replace(/dark:bg-orange-900\/30/g, 'dark:bg-orange-500/15');
    content = content.replace(/dark:border-orange-800/g, 'dark:border-orange-500/20');

    content = content.replace(/dark:bg-amber-900\/20/g, 'dark:bg-amber-500/10');
    content = content.replace(/dark:bg-amber-900\/30/g, 'dark:bg-amber-500/15');
    content = content.replace(/dark:border-amber-800/g, 'dark:border-amber-500/20');

    fs.writeFileSync(file, content, 'utf-8');
});

console.log('Dark mode colors improved.');
