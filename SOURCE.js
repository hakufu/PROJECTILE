const Command = require('command')
const {protocol} = require('tera-data-parser')
const StateTracker = require('tera-state-tracker')
    
module.exports = function ProjectileExploit(dispatch) {
   const command = Command(dispatch)
   const state = StateTracker(dispatch)
  
	let cid = null
  let model = null
	let enabled = false
	let auto = false
	let block = false
	let targetAll = false
	let plyrs = false
	let single = false
	let debug = false
	let crystall = false
	
  //TARGET
  let singleTargets = []
	let loadedNpcs = []
	let loadedUsers = []
  let crys = []
	
  //Slash Invisible
  let projectileCoords = {}
 
	//for func
	let course = false
	let SATAN = true
	let admId = []
	let singleDel = []
	let filterx = true
  let fake = false
	let projectileIds = []
  let projectileIdx = 0
	let timer = null
	let zone = []
	let skillid = 0
  let players = {}
	let targetIds = []
	let targetIdx = 0
	var hitCount = 0
	//--->
  let targetEnqueuedHits = {}
  let lastDequeueTime = 0
	
	//filter
	let party_filter = []
	let gmask = ["Query","ff","Ruuvi"]
	let gmask_size = gmask.length
	let mask = []
  let mask_size = 0

	//timertick
  let timerTick = 9 //время в мс через которое сработает runTimer
  let mult = 1 //множитель
  let HIT = 81 //пакеты
  
	//shift
	let shift = 0
	let curX = 0
	let curY = 0
	let curZ = 0
	
  //REGION BLOCK
  //var reg = ["26", "33"] //EU
  //var reg = ["4004", "4032"] //NA
  //var reg = ["500", "501"] //RU
  //var reg = ["4032", "4032"] //FF 4032
  
	command.add('pr', () => {
	if (!SATAN){
    if (!block){
      enabled = !enabled
      command.message('<font color="#00ffff">[Projectile] Module </font><font color="#ffff00">'+(enabled?'Enabled':'Disabled')+'.</font>')
      command.message('<font color="#56B4E9">Info /8 prhelp</font>')
    }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#E69F00">Sorry, not work for your class!</font>')
	}}else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">ERROR: Please, write Ruuvi#3827</font>')
	    console.error('ERROR: Please, write Ruuvi#3827')
      process.exit()
	}
  })

	command.add('prauto', () => {
	if (enabled){
	mult = 1
	if (targetAll || plyrs){
		auto = !auto
		course = false
    command.message('<font color="#E69F00">[BAN WARNING]</font> <font color="#ffff00">This function is not recommended to use!</font>')
		command.message('<font color="#00ffff">[Projectile]</font>Auto is <font color="#ffff00">'+(auto?'Enabled':'Disabled')+'</font>')
    }else{
    auto = false
    command.message('<font color="#00ffff">[Projectile AUTO]</font><font color="#E69F00"> For use this function, ENABLE "/praim 2" OR "/prnpc"!</font>')}
  }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
  
  })

	command.add('prdebug', () => {
	if (enabled){
		debug = !debug
		command.message('<font color="#E69F00">[Projectile DeBuG]</font> <font color="#ffff00">'+(debug?'Enabled':'Disabled')+'.</font>')
  }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
})

	command.add('prcrys', () => {
	if (enabled){
	if (116 === zone) {
	  if (crystall == false) {
      crystall = true
      targetAll = false
      plyrs = false
      auto = false
      single = false
      course = true
      crys = []
      singleTargets = []
      targetIds = []
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Crystall target is Enabled.</font>')
	}else{
	crystall = false
	course = false
	crys = []
	targetIds = []
	command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Crystall target is Disabled.</font>')
	}}else{
	crystall = false
	command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Only Corsair!</font>')}
	}else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
	})

	command.add('s', (t) => {
	if (enabled){
   	single = true
    targetAll = false
    auto = false
    plyrs = false
    crystall = false
    targetIds = []
    
    if (t === undefined || t == '') {
      single = false
      singleTargets = []
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player selected is DISABLED</font>')
    return}else
    if (t === 'clear') {
      singleTargets = []
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Select list has been cleared!</font>')
    return}else
    if (t === 'scan') {
        let l1 = singleTargets.length
        for (let x of loadedUsers) {
            if (findInArray(singleTargets, x) === -1) {
                singleTargets.push(x)
            }
        }
        let l2 = singleTargets.length
        command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Added '+(l2-l1)+' users to select list..</font>')
        return
    }else{
     if (getPidforName(t) === undefined){
        findUserCidAsync(t, (cid) => {
       if (cid === null) {
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player Not Found!</font>')
           return}else{
       let i;
       if ((i = findInArray(singleDel, cid.low)) === -1) {
           singleDel.push(cid.low)
           singleTargets.push(cid)
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player '+t+' add to list. PPL:</font>'+singleTargets.length)
           }else{
           singleTargets.forEach(function(item, i) {
             if (item.low === cid.low) {
                 singleTargets.splice(i, 1);
               }
          })
           singleDel.splice(i, 1);
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player '+t+' deleted from list.. PPL:</font>'+singleTargets.length)
          }
        }
    })
    }else{
        let newCID = foo(decToHex(getPidforName(t)))
        if ((i = findInArray(singleDel, newCID.low)) === -1) {
          singleDel.push(newCID.low)
          singleTargets.push(newCID)
          command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player '+t+' add to list. ('+ getPidforName(t) + ') PPL:</font>'+singleTargets.length)
        }else{
           singleTargets.forEach(function(item, i) {
             if (item.low === newCID.low) {
                 singleTargets.splice(i, 1);
               }
          })
           singleDel.splice(i, 1);
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Player '+t+' deleted from list.. PPL:</font>'+singleTargets.length)
          }
   }}
  }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
 })


function foo(str){
            let high = parseInt(str.slice(0,7), 16)
            let low = parseInt(str.slice(-6), 16)
            return {low: low, high: high, unsigned: true } //Можно просто {low, hight}
        }

////////////////////////////////
//////////HEX FUNCTION//////////
////////////////////////////////
// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length);
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  while (true) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str, base) {
  var digits = str.split('');
  var ary = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = parseInt(digits[i], base);
    if (isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
}

function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (var i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';
  for (var i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}

function decToHex(decStr) {
  var hex = convertBase(decStr, 10, 16);
  //  return hex ? '0x' + hex : null;
  return hex ? '' + hex : null;
}

function hexToDec(hexStr) {
  if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
  hexStr = hexStr.toLowerCase();
  return convertBase(hexStr, 16, 10);
}

////////////////////////////////
//////////END FUNCTION//////////
////////////////////////////////


	function findUserCidAsync(name, fn) {
        let ary = []
        
        let hook = dispatch.hookOnce('S_NPCGUILD_LIST', 1, (ev) => {
            if (ary.length === 0) {
                ary.push(1)
                fn(Object.assign({}, ev.cid))
            }
        })
        
        setTimeout(() => {
            if (ary.length === 0) {
                ary.push(1)
                fn(null)
            }
        }, 2000)
        
        dispatch.toServer('C_NPCGUILD_LIST', 1, {
            'name': name
        })
	}
	
	command.add('prhelp', () => {
		command.message('<font color="#E69F00">================Projectile================</font>')
		command.message('<font color="#56B4E9">1. /pr - Enable or Disable Module</font>')
		command.message('<font color="#56B4E9">2. /praim [] - Target Players.</font>')
		command.message('<font color="#56B4E9">3. /prnpc [] - Target Monsters.</font>')
		command.message('<font color="#56B4E9">4. /s [Nick] - NAME Target. Add [clear] and [scan] commands.</font>')
		command.message('<font color="#56B4E9">5. /pew [sec][packets][ih] - Damage Config.</font>')
		command.message('<font color="#56B4E9">6. /plist - Player List.</font>')
		command.message('<font color="#56B4E9">7. /prauto - Auto Damage Config.</font>')
		command.message('<font color="#56B4E9">8. /shift [] - Change Z coordinate.</font>')
		command.message('<font color="#56B4E9">9. /prcrys - Target Crystall (Corsair Only!)</font>')
		command.message('<font color="#E69F00">==================RTPort===================</font>')
		command.message('<font color="#56B4E9">1. /coord - Look your coordinate.</font>')
		command.message('<font color="#56B4E9">2. /tp [x] [y] [z] - Teleport to your coordinate.</font>')
		command.message('<font color="#56B4E9">3. /crys - Teleport to Crystall.</font>')
		command.message('<font color="#56B4E9">4. /ll - Left Ladder.</font>')
		command.message('<font color="#56B4E9">5. /rl - Right Ladder.</font>')
		command.message('<font color="#56B4E9">6. /hide - HIDE ZONE (FUN)</font>')
		command.message('<font color="#56B4E9">==========================================</font>')
		command.message('<font color="#E69F00">FIX by Ruuvi, build version 10.02.2018</font>')
	})
	
   command.add('prnpc', (arg) => {
	if (enabled){
       if (arg === undefined) arg = ''
       arg = '' + arg

       if (['one', '1'].includes(arg.toLowerCase())) {
           targetAll = true
           plyrs = false
           single = false
           course = true
           singleTargets = []
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">iN Course MODE Enabled!</font>')
       } else if (['off', '0'].includes(arg.toLowerCase())) {
           targetAll = false
           course = false
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Targeting NPCs disabled.</font>')
       } else if (['all', '2'].includes(arg.toLowerCase())) {
           targetAll = true
           plyrs = false
           single = false
           course = false
           singleTargets = []
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Targeting all NPCs enabled.</font>')
       } else {
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Use [/prnpc one] or [/prnpc all].</font>')
       }
    }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
   })
	
	
   command.add('praim', (arg) => {
	if (enabled){
       if (arg === undefined) arg = ''
       arg = '' + arg

       if (['true', 'on', 'y', '1'].includes(arg.toLowerCase())) {
           plyrs = true
           targetAll = false
           single = false
           course = true
           singleTargets = []
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">iN Course MODE Enabled!</font>')
       } else if (['false', 'off', 'n', '0'].includes(arg.toLowerCase())) {
           plyrs = false
           course = false
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Targeting players Disabled.</font>')
       } else if (['all', 'a', '2'].includes(arg.toLowerCase())) {
           plyrs = true
           targetAll = false
           single = false
           course = false
           singleTargets = []
           targetIds = []
           crys = []
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Targeting all players Enabled.</font>')
       } else {
           command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Use [/praim true] or [/praim all].</font>')
       }
     }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
   })
	
	command.add('shift', (offset) => {
		shift = parseFloat(offset)
		command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Shift '+(shift)+'.</font>')
	})
	
  command.add('pew', (newTick, newMult, newHIT) => {
	if (enabled){
  if (newTick === undefined || newTick < 1) newTick = 12
  if (newMult === undefined || newMult < 1) newMult = 1
  if (newHIT < 5) newHIT = 5
  if (newHIT === undefined) newHIT = 30
    timerTick = newTick
    mult = newMult
    HIT = newHIT
    if (newHIT > 80){command.message('<font color="#E69F00">[BAN WARNING]</font> <font color="#ffff00">CHANGE PACKET LIMIT less than 80!</font>')}
    command.message('<font color="#00ffff">[Projectile]</font> Timer Tick changed to <font color="#ffff00">'+(timerTick)+'ms.</font>')
    command.message('<font color="#00ffff">[Projectile]</font> Iteration Hit changed to <font color="#ffff00">'+(mult)+'x.</font>')
    command.message('<font color="#00ffff">[Projectile]</font> Packets limit changed to <font color="#ffff00">'+(HIT)+' packets.</font>')
    }else{
      command.message('<font color="#00ffff">[Projectile]</font> <font color="#FF0000">MOD is OFF: Please use !pr </font>')
	}
  })

	command.add('plist', () => {
	var playerslist = '{'
		for (var key in players) {
			playerslist += '[' + players[key] + '], '
		}
	    playerslist+='}'
		command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Players: </font>' + playerslist)
	})


  function dequeueTargetHits() {
    let time = Date.now() - lastDequeueTime

      for (let i = 0; i < targetIds.length; i++) {
      
           let decid = targetIds[i]
           let scid = decid.toString()
           let curHits = targetEnqueuedHits[scid]
           
           if (curHits === undefined) continue
          
           let hitsToDequeue = parseFloat(time) / parseFloat(2*hitCount)
           curHits -= hitsToDequeue
           
           if (curHits < 0) {
           curHits = 0
           targetEnqueuedHits[scid] = curHits
       }}
      lastDequeueTime = Date.now()
  }

  function Region(id){
  	if (id < reg[0]) {
    return true
    }else
    if (id > reg[1]){
    return true
    }else{
    return false}
    }

	function Reload() {
		fake = false
		hitCount = 0
    //command.message('<font color="#00ffff">[Projectile]</font> Module is RELOAD!')
   }

   function enqueueTargetHit() {
   	let tumbler = 1
     if (targetIdx >= targetIds.length) targetIdx = 0
     if (single & singleTargets.length <= 1) {tumbler = 0} else {tumbler = 1}
     if (course) {tumbler = 0} else {tumbler = 1}
     
	     for (let i = targetIdx; i < targetIds.length; i++) {
         let ecid = targetIds[i]
         let scid = ecid.toString()
         let a = findInArray(admId, ecid)
         let curHits = targetEnqueuedHits[scid]
         let MaxQueue = HIT * targetIds.length
         
         if (curHits === undefined) curHits = 0
         if (Math.ceil(curHits) >= MaxQueue) {
          continue
         }
         
         curHits++
         targetEnqueuedHits[scid] = curHits
         targetIdx = i+tumbler
         
        if (a === -1 && !fake) {
        return ecid
        }
  }
            targetIdx = 0
            return null
  }


	dispatch.hook('S_LOGIN', 2, (event) => {
    SATAN = Region(event.serverId)
    enabled = false
    Reload()
		cid = event.cid
		model = event.model % 100
		
//# warrior = 1, lancer = 2, slayer = 3, berserker = 4,
//# sorcerer = 5, archer = 6, priest = 7, mystic = 8,
//# reaper = 9, gunner = 10, brawler = 11, ninja = 12,
//# valkyrie = 13

		if (model == 5){
		block = false
		mask = ["67149", "67150"]
		}else
		if (model == 7){
		block = false
		mask = ["67509"]
		}else
		if (model == 10){
		block = false
		mask = ["67179"]
		}else
		if (model == 12){
		block = false
		mask = ["67138", "67139"]
		}else
		if (model == 13){
		block = false
		mask = ["67209", "67214"]
		}else{
		block = true
		}
		mask_size = mask.length
	})
	
	 //////////////////
	///FILTER BLOCK///
 //////////////////

   dispatch.hook('S_PARTY_MEMBER_LIST', 5, event => {
   for (let x in event.members){
        party_filter.push(event.members[x].cid.toString())
   }})

   dispatch.hook('C_LEAVE_PARTY', (event) => {
   admId = []
   targetIds = []
   party_filter = []
   })
   
   dispatch.hook('C_LOAD_TOPO_FIN', (event) => {
   admId = []
   targetIds = []
   loadedUsers = []
   loadedNpcs = []
   projectileIds = []
   })
   
   dispatch.hook('S_LOAD_TOPO', (event) => {
   party_filter = []
   zone = event.zone
        })
   
//======================================

	dispatch.hook('C_PLAYER_LOCATION', 2, (event) => {
		curX = event.x
		curY = event.y
		curZ = event.z
		if (shift === 0) return
		event.z += shift
		event.toZ += shift
		return true
	})
	
	dispatch.hook('S_ACTION_STAGE', 1, (event) => {
		if (shift === 0) return
		if (event.source.toString() !== cid.toString()) return
		event.x = curX
		event.y = curY
		event.z = curZ
		return true
	})
	
	dispatch.hook('S_ACTION_END', 1, (event) => {
		if (shift === 0) return
		if (event.source.toString() !== cid.toString()) return
		event.x = curX
		event.y = curY
		event.z = curZ
		return true
	})
	
	dispatch.hook('S_SPAWN_NPC', 4, (event) => {
   if (event.huntingZoneId == 116 & event.templateId == 2000 & crystall == true) {
    crys = event.id
    command.message('<font color="#00ffff">[Projectile]</font> <font color="#ffff00">Crystall found: '+(event.id)+'.</font>')
    }else{
    loadedNpcs.push(event.id)
    }
	})
	
	dispatch.hook('S_DESPAWN_NPC', 1, (event)  => {
    if(!plyrs && !targetAll){
    removeTarget(event.target)
    }
	
    if(targetAll && course){
    removeTarget(event.target)
		}
	
		for (let i = 0; i < loadedNpcs.length; i++) {
			if (loadedNpcs[i].toString() === event.target.toString()) {
				loadedNpcs.splice(i, 1)
				i--;
			}
		}
		})

function IncMask (inc, size, msa) {
	  for(var i = 0; i < inc.length; i++) {
        for(var n = 0; n < size; n++) {
            if(inc.indexOf(msa[n]) != -1) {
                return n;
            }}
  }
  return -1
}
	
	dispatch.hook('S_SPAWN_USER', 11, (event) => {
     let gname = event.guild.toString()
     let filter2 = IncMask(gname, gmask_size, gmask)
        if (filter2 == -1){
        loadedUsers.push(event.gameId)
        players[event.gameId] = event.name;
          for (let i = 0; i < party_filter.length; i++) {
            if (party_filter[i].toString() === event.gameId.toString()) {
              loadedUsers.splice(i, 1)
              i--;
              return
           }
         }
      }else{
    admId.push(event.gameId)
    }
  })
	
	dispatch.hook('S_DESPAWN_USER', 3, (event) => {
	
		if(plyrs && course){
    removeTarget(event.target)
		}
	
		for (let i = 0; i < party_filter.length; i++) {
			if (party_filter[i].toString() === event.gameId.toString()) {
				loadedUsers.splice(i, 1)
				i--;
				return
			}
		}
		delete players[event.gameId]
	})
	
	function getPidforName(name) {
		for(var key in players) {
			if (players[key] === name) {
			    return key
			}
		}
	}
	
	
  function findInArray(ary, item) {
    for (let i = 0; i < ary.length; i++) {
    if (ary[i].toString() === item.toString()) {
   return i
   }}
    return -1
  }

//Skill Filter
//setInterval(10000)
  dispatch.hook('C_START_SKILL', 3, (event) => {
  skillid = event.skill.toString()
  if (!enabled) return
  let filter1 = IncMask(skillid, mask_size, mask)

  if (filter1 == -1 && zone != 102) {
		if(debug){console.log('S_FILTER: ' + event.skill)}
    filterx = true
    return
  }else{
    if(debug){console.log('S_PASS: ' + event.skill)}
    filterx = false
    return;
  }

})

//RUN TIMER Func!
  function runTimer() {
     if (!enabled || projectileIds.length === 0 || targetIds.length === 0 || filterx) {
          killTimerIfAppropiate()
          return
     }
     
     if (fake){
        setTimeout(Reload, 2000)
        killTimerIfAppropiate()
        command.message('<font color="#E69F00">[Projectile]</font>Packet limit reached!: ' + hitCount)
      return
     }
     
     if (projectileIdx >= projectileIds.length) {
         projectileIdx = 0
     }
  
     if (auto){
      let AutoPacketFix = HIT*targetIds.length
      if (hitCount >= AutoPacketFix) fake = true
      }else{
        if (hitCount >= HIT) fake = true}
        
     let iterationHits = 1*mult
     if (auto && targetAll){
         iterationHits = loadedNpcs.length*mult
     }else
     if (auto && plyrs){
         iterationHits = loadedUsers.length*mult
     }
    
     let hitCoords = state.server.position
     hitCoords = hitCoords.add(state.server.lookVec.mul(5))
     hitCoords.z += 40
        let packet = {
           source: projectileIds[projectileIdx],
           end: 0,
            x: hitCoords.x,
            y: hitCoords.y,
            z: hitCoords.z,
                targets: []
        }
        dequeueTargetHits()
      while (packet.targets.length < iterationHits) {
      if(debug){command.message('<font color="#E69F00">[Projectile DeBuG]</font> Packets: ' + hitCount)}
              let targetCid = enqueueTargetHit()
              if (targetCid === null) break
              packet.targets.push({
                    target: targetCid,
                    unk1: 0
             })
          
             hitCount++
      }
    if (packet.targets.length > 0) {
        let rawPacket = Buffer.from(protocol.write(dispatch.base.protocolVersion, 'C_HIT_USER_PROJECTILE', 2, packet).toString('hex'), 'hex')
        dispatch.toServer(rawPacket)
    }
    projectileIdx++
    killTimerIfAppropiate()
    setTimerIfAppropiate()
}
	
//$ ADD TARGETS AND REMOVE TARGETS
   function addTarget(targetId, projectileId) {
        if (findInArray(targetIds, targetId) === -1) {
            targetIds.push(targetId)
            }
            startTimerIfAppropiate()
 }

   function removeTarget(targetId) {
        let i = 0
        while ((i = findInArray(targetIds, targetId)) >= 0) {
        targetIds.splice(i, 1)
     }
        killTimerIfAppropiate()
 }

//$ ADD PACKETS
   function addProjectile(projectileId, projectilePos) {
      if (findInArray(projectileIds, projectileId) === -1) {
                projectileIds.push(projectileId)
                projectileCoords[projectileId.toString()] = projectilePos
            }
           startTimerIfAppropiate()
  }

//$ CLEAR PROJECTILE!
    function removeProjectile(projectileId) {
        let i = 0
        while ((i = findInArray(projectileIds, projectileId)) >= 0) {
            projectileIds.splice(i, 1)
            delete projectileCoords[projectileId.toString()] 
      }
        killTimerIfAppropiate()
    }
 
//$ TIMERS!
    function startTimerIfAppropiate() {
       setTimeout(() => {
       if (timer === null) {
          runTimer()
     }}, 0)
 }

    function setTimerIfAppropiate() {
      if (enabled && projectileIds.length > 0 && targetIds.length > 0 && !filterx) {
      if (timer !== null) {
         clearTimeout(timer)
         timer = null
     }
         timer = setTimeout(runTimer, timerTick)
     }
 }

   function killTimerIfAppropiate() {
       if (!enabled || projectileIds.length === 0 || targetIds.length === 0 || filterx) {
       if (timer !== null) {
           clearTimeout(timer)
           timer = null
      }}
}

//$ C_START
  dispatch.hook('S_START_USER_PROJECTILE', 2, {
      filter: {
          fake: false,
          silenced: null
     }}, (event) => {
     if (!enabled) return
     if (filterx) return
     if (!state.isMe(event.source)) return
     
     addProjectile(event.id, state.server.position.add(state.server.lookVec))

      if (targetAll) {
          for (let npc of loadedNpcs) {
               addTarget(npc, event.id)
         }
     }else
      if (single) {
          for (let single of singleTargets) {
               addTarget(single, event.id)
         }
    }else
      if (plyrs) {
          for (let user of loadedUsers) {
          addTarget(user, event.id)    
         }
    }else
      if (crystall & crys > 0) {
               addTarget(crys, event.id)
    }else{
    course = false}
 })
//$ C_HIT
   dispatch.hook('C_HIT_USER_PROJECTILE', 2, {
      filter: {
           fake: false,
           silenced: null
            }}, (event) => {
  if (event.end !== 0) {
			removeProjectile(event.source)
			return}
  if (!enabled) return
  if (filterx) return
  if (!targetAll && !plyrs && !single) {
     for (let tgt of event.targets) {
          addTarget(tgt.target, event.source)
          }
      }
     return false
  })
	
  dispatch.hook('S_END_USER_PROJECTILE', 1, {
    filter: {
        fake: false,
        silenced: null
   }}, (event) => {
     removeProjectile(event.id)
     if(debug & targetIds.length >= 1){command.message('<font color="#E69F00">[Projectile DeBuG]</font> <font color="#ffff00">Targets highlighted: '+(targetIds.length)+'.</font>')}
    })
      
   dispatch.hook('S_EACH_SKILL_RESULT', (event) => {
   if (enabled && projectileIds.length > 0 && targetIds.length > 0) return false 
   })


}