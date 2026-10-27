from pathlib import Path
p=Path('work/performance/test-music.mjs');s=p.read_text(encoding='utf-8').replace('load(){}async play()',"load(){}pause(){this.paused=true;this.emit('pause')}async play()")
s=s.replace("audio.emit('loadedmetadata');await Promise.resolve();assert.equal(audio.currentTime,40);assert.equal(audio.paused,false);","audio.emit('loadedmetadata');assert.equal(audio.currentTime,40);assert.equal(audio.paused,true);audio.emit('seeked');await Promise.resolve();assert.equal(audio.paused,false);")
s=s.replace("assert.equal(local.get('hayden-music-muted'),'true');",'')
s=s.replace("audio.emit('ended');await Promise.resolve();assert.equal(audio.currentTime,40);assert.equal(audio.paused,false);","audio.emit('ended');assert.equal(audio.currentTime,40);assert.equal(audio.paused,true);audio.emit('seeked');await Promise.resolve();assert.equal(audio.paused,false);")
s=s.replace('starts at 40s, mute/unmute, remembered preference, end loops to 40s.','waits for seek completion before first playback and every loop; starts at 40s; mute/unmute works.')
p.write_text(s,encoding='utf-8')
