from pathlib import Path
import json,re,html
r=Path('work/apex/dist')
copy={
'TypeScript':('JavaScript with a little more help catching mistakes',[['Cortex','We used TypeScript with React and Next.js to build Cortex'],['altF4 invest','We also used it while building altF4 invest']]),
'JavaScript':('Making web pages actually do things',[['altF4 invest','I used JavaScript while working on the investing platform']]),
'Python':('Scripts, libraries, and getting things done with code',[['Writing Python','I’ve used Python in my programming work, including libraries like requests']]),
'Java':('One of the languages I use to build software',[['Writing Java','I work with Java alongside tools like JavaFX and IntelliJ']]),
'C':('Getting a bit closer to how the computer works',[['Writing C','C is one of the languages I’ve worked with']]),
'C++':('C++, with CLion usually close by',[['Writing C++','I use C++ and CLion as part of my programming work']]),
'SQL':('Getting the data I need out of a database',[['Working with data','I use SQL to ask a database for the information I’m looking for']]),
'React':('Putting web interfaces together, one component at a time',[['Cortex','We used React to build the parts of Cortex people interact with'],['altF4 invest','React also helped us put the investing platform’s interface together']]),
'Next.js':('What we built Cortex and altF4 invest with',[['Cortex','We built Cortex on Next.js'],['altF4 invest','We used Next.js for this one too']]),
'Tailwind CSS':('Styling things right where I’m building them',[['Cortex','We used Tailwind to style Cortex’s interface']]),
'HTML':('Giving a web page its structure',[['altF4 invest','I used HTML while working on the platform’s web interface']]),
'CSS':('Making the page look the way I want it to',[['altF4 invest','I used CSS to work on how the platform looks']]),
'JavaFX':('Making desktop interfaces with Java',[['Desktop apps','I use JavaFX when working on interfaces for Java apps']]),
'Node.js':('Running JavaScript outside the browser',[['Web projects','Node.js is part of the setup I use for JavaScript development']]),
'Supabase':('Handling app data and user accounts',[['Cortex','Supabase was part of the stack we used for Cortex'],['altF4 invest','We used Supabase for things like accounts and saved progress']]),
'requests':('Getting Python to talk to a website or API',[['Python scripts','I use requests to send HTTP requests from Python']]),
'Git':('Keeping track of what changed',[['Working on projects','I use Git to track changes and work on code with other people']]),
'VS Code':('One of the editors I write code in',[['Writing code','I use VS Code as part of my development setup']]),
'IntelliJ IDEA':('An editor I use for Java',[['Java projects','IntelliJ is one of the tools I use when working with Java']]),
'CLion':('An editor I use for C and C++',[['C and C++ projects','I use CLion when working with C and C++']]),
'Codex':('A coding assistant I’ve used throughout this portfolio',[['This website','I’ve used Codex to work on the layout, McLaren interactions, music, and this tooling page']]),
'Claude':('The AI we used in Cortex',[['Cortex','We used Claude to help teams work with shared context across departments']]),
'Excel':('Spreadsheets that do more of the work for you',[['Arguson Projects','I built Excel and VBA automations for finance work'],['Less repetitive work','Some jobs that took an hour came down to about five minutes']]),
'VBA':('Getting Excel to handle the repetitive stuff',[['Arguson Projects','I built 30+ Excel/VBA macros for finance tasks'],['CMiC exports','I set things up so macros could run when CMiC data was exported']])
}
p=r/'tooling.js';s=p.read_text(encoding='utf-8');a=s.index('const usage=');b=s.index('\nconst tiles=',a);s=s[:a]+'const usage='+json.dumps({name:cases for name,(_,cases) in copy.items()},ensure_ascii=False,indent=1)+';'+s[b:];p.write_text(s,encoding='utf-8')
p=r/'tools.html';s=p.read_text(encoding='utf-8')
def update(m):
 tag=m.group(0);name=html.unescape(re.search(r'data-tool="([^"]*)"',tag).group(1))
 return re.sub(r'data-description="[^"]*"','data-description="'+html.escape(copy[name][0],quote=True)+'"',tag)
s=re.sub(r'<button\b[^>]*class="tool-tile"[^>]*>',update,s);s=s.replace('tooling.js?v=tooling21','tooling.js?v=casual22');p.write_text(s,encoding='utf-8')
print('Rewrote summaries and usage text for',len(copy),'tools')
