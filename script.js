const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const screens=$$(".screen");
let state={name:"",phone:"",score:0,level:1,difficulty:"medium",timer:null,timeLeft:0,level2Passed:false};
const difficulties={easy:{time:60,points:10000},medium:{time:40,points:20000},hard:{time:25,points:30000}};
function show(id){screens.forEach(s=>s.classList.remove("active"));$("#"+id).classList.add("active");updateScores();window.scrollTo(0,0)}
function updateScores(){$$(".total-score").forEach(e=>e.textContent=state.score.toLocaleString())}
function startGame(){
  const name=$("#playerName").value.trim();
  const phone=$("#playerPhone").value.replace(/\D/g,"");
  const phoneError=$("#phoneError");
  if(!name){alert("Please enter your name.");return}
  if(phone.length!==11){
    phoneError.textContent="Please write your correct 11 numbers.";
    phoneError.classList.remove("hidden");
    return;
  }
  phoneError.classList.add("hidden");
  state={name,phone,score:0,level:1,difficulty:"medium",timer:null,timeLeft:0,level2Passed:false};
  show("wheelScreen")
}
function spin(){
  $("#spinBtn").disabled=true;$("#wheelStatus").textContent="Spinning...";
  const level=Math.floor(Math.random()*3)+1; state.level=level;
  const base={1:60,2:300,3:180}[level], turns=5*360;
  $("#wheel").style.transform=`rotate(${turns+base}deg)`;
  setTimeout(()=>{$("#landedLevel").textContent=`LEVEL ${level}`;$("#startLevelBtn").textContent=`START LEVEL ${level}`;show("levelLanding");$("#spinBtn").disabled=false},4700)
}
function openLevel(){if(state.level===1){buildJenga();show("level1")}else if(state.level===2)show("level2Menu");else show("level3Menu")}
function buildJenga(){show("level1")}
const suitcaseItems=[["😎","Sunglasses"],["🧴","Sunscreen"],["🪪","GIG Travel Insurance Card"],["🔌","Charger"],["🏖️","Towel"]];
let suitcaseStep=0,suitcaseCorrect=0,missingIndex=0;
function startSuitcase(){suitcaseStep=0;suitcaseCorrect=0;show("suitcase");renderSuitcase()}
function renderSuitcase(){
 const c=$("#suitcaseContent");
 if(suitcaseStep===0){c.innerHTML=`<p>Memorize these 5 vacation essentials. You have 8 seconds.</p><div class="memory-items">${suitcaseItems.map(x=>`<div class="memory-item"><span>${x[0]}</span>${x[1]}</div>`).join("")}</div><p class="status">Get ready...</p>`;setTimeout(()=>{suitcaseStep=1;renderSuitcase()},8000);return}
 if(suitcaseStep===1){missingIndex=Math.floor(Math.random()*5);let shown=suitcaseItems.filter((_,i)=>i!==missingIndex);c.innerHTML=`<h3>Question 1 of 3</h3><p>Which item is missing?</p><div class="memory-items">${shown.map(x=>`<div class="memory-item"><span>${x[0]}</span>${x[1]}</div>`).join("")}</div><div class="quiz-options">${suitcaseItems.map((x,i)=>`<button class="option" data-answer="${i}">${x[1]}</button>`).join("")}</div>`;c.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(+b.dataset.answer===missingIndex)suitcaseCorrect++;suitcaseStep=2;renderSuitcase()});return}
 if(suitcaseStep===2){let extra=["🎧","Headphones"];let six=[...suitcaseItems,extra].sort(()=>Math.random()-.5);c.innerHTML=`<h3>Question 2 of 3</h3><p>Which item was NOT originally in the suitcase?</p><div class="quiz-options">${six.map(x=>`<button class="option" data-answer="${x[1]}">${x[0]} ${x[1]}</button>`).join("")}</div>`;c.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.dataset.answer==="Headphones")suitcaseCorrect++;suitcaseStep=3;renderSuitcase()});return}
 if(suitcaseStep===3){let opts=["Motor Insurance Card","Travel Insurance Card","Home Insurance Card","Health Insurance Card"];c.innerHTML=`<h3>Question 3 of 3</h3><p>What type of GIG insurance card was shown?</p><div class="quiz-options">${opts.map(x=>`<button class="option" data-answer="${x}">${x}</button>`).join("")}</div>`;c.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.dataset.answer==="Travel Insurance Card")suitcaseCorrect++;finishLevel2()})}
}
const riskScenes=[
{id:"factory",name:"Factory",left:"assets/factory-1.png",right:"assets/factory-2.png",spots:[[12,28],[49,75],[66,50],[85,82],[95,38]]},
{id:"home",name:"Home",left:"assets/home-1.png",right:"assets/home-2.png",spots:[[25,61],[14,73],[30,39],[62,70],[92,68]]},
{id:"office",name:"Office",left:"assets/office-1.png",right:"assets/office-2.png",spots:[[7,63],[40,66],[29,85],[72,67],[82,84]]}];
let riskScene,riskFound=0,riskSeconds=30,riskTimerHandle;
function startRisk(){let last=localStorage.getItem("gigLastRiskScene"),pool=riskScenes.filter(x=>x.id!==last);riskScene=pool[Math.floor(Math.random()*pool.length)];localStorage.setItem("gigLastRiskScene",riskScene.id);riskFound=0;riskSeconds=30;show("risk");renderRisk();clearInterval(riskTimerHandle);$("#riskTimer").textContent="30s";riskTimerHandle=setInterval(()=>{riskSeconds--;$("#riskTimer").textContent=riskSeconds+"s";if(riskSeconds<=0){clearInterval(riskTimerHandle);finishRisk()}},1000)}
function renderRisk(){let c=$("#riskContent");c.innerHTML=`<div class="risk-progress"><span>${riskScene.name} Scene</span><span id="riskFoundCount">0 / 5 found</span></div><div class="risk-pair"><div class="risk-image-box"><img src="${riskScene.left}" alt="${riskScene.name} original"></div><div class="risk-image-box risk-clickable"><img src="${riskScene.right}" alt="${riskScene.name} differences">${riskScene.spots.map((p,i)=>`<button class="risk-hotspot" style="left:${p[0]}%;top:${p[1]}%" data-i="${i}"></button>`).join("")}</div></div>`;c.querySelectorAll(".risk-hotspot").forEach(x=>x.onclick=()=>{if(x.classList.contains("found"))return;x.classList.add("found");riskFound++;$("#riskFoundCount").textContent=riskFound+" / 5 found";if(riskFound===5){clearInterval(riskTimerHandle);finishRisk()}})}
function finishRisk(){clearInterval(riskTimerHandle);if(riskFound>=3){state.score+=20000;showResult("LEVEL 2 PASSED!",`You found ${riskFound} out of 5 differences.`,`CONTINUE TO LEVEL 3`,()=>show("level3Menu"))}else showResult("TIME'S UP",`You found ${riskFound} out of 5 differences. Find at least 3 to pass.`,`CHOOSE ANOTHER LEVEL 2 GAME`,()=>show("level2Menu"))}
function finishLevel2(){let correct=suitcaseCorrect;state.level2Passed=correct>=2;if(state.level2Passed){state.score+=20000;showResult("LEVEL 2 PASSED!",`You got ${correct} out of 3 correct and earned 20,000 points.`,`CONTINUE TO LEVEL 3`,()=>show("level3Menu"))}else showResult("TRY AGAIN",`You got ${correct} out of 3 correct. You need at least 2 correct answers.`,`CHOOSE ANOTHER LEVEL 2 GAME`,()=>show("level2Menu"))}
function getDifficulty(){state.difficulty=$('input[name="difficulty"]:checked').value;return difficulties[state.difficulty]}
const emojiQs=[
 {e:"🚗🛣️💥🛡️",a:"Motor",o:["Motor","Travel","Home","Health"]},
 {e:"✈️🧳🌍🛡️",a:"Travel",o:["Home","Travel","Motor","Personal Accident"]},
 {e:"🏠🔥🔑🛡️",a:"Home Secure",o:["Health","Motor","Home","Travel"]},
 {e:"🩺❤️🏥🛡️",a:"Medical",o:["Travel","Health","Home","Motor"]},
 {e:"🚶⚠️🤕🛡️",a:"Personal Accidents",o:["Motor","Personal Accident","Travel","Home"]}
];let emojiStep=0,emojiCorrect=0;
function startEmoji(){emojiStep=0;emojiCorrect=0;show("emoji");startTimer("emojiTimer",()=>finishLevel3(false,"Time is up!"));renderEmoji()}
function normalizeInsuranceAnswer(v){return v.trim().toLowerCase().replace(/[^a-z ]/g,"").replace(/\\s+/g," ")}
function renderEmoji(){let q=emojiQs[emojiStep],c=$("#emojiContent");c.innerHTML=`<p>Question ${emojiStep+1} of 5</p><div class="emoji-clue">${q.e}</div><p>Type the insurance name.</p><div class="answer-input-row"><input id="emojiAnswer" type="text" placeholder="Enter insurance name"><button id="submitEmoji" class="shell-btn small">SUBMIT</button></div>`;let submit=()=>{let a=normalizeInsuranceAnswer($("#emojiAnswer").value),aliases={"Motor":["motor","motor insurance"],"Travel":["travel","travel insurance"],"Home Secure":["home secure","home secure insurance","home"],"Medical":["medical","medical insurance","health"],"Personal Accidents":["personal accidents","personal accident","personal accident insurance"]};if((aliases[q.a]||[]).includes(a))emojiCorrect++;emojiStep++;if(emojiStep<5)renderEmoji();else finishLevel3(emojiCorrect>=3,`You got ${emojiCorrect} out of 5 correct.`)};$("#submitEmoji").onclick=submit;$("#emojiAnswer").onkeydown=e=>{if(e.key==="Enter")submit()}}
const emergencies=[
{title:"Minor Car Accident",icon:"🚗💥🚙",text:"Another vehicle lightly hits your car in a parking lot.",correct:0,choices:["Ensure everyone is safe, take photos, exchange information, and report the incident.","Drive away immediately.","Avoid documenting the incident.","Repair first and report weeks later."]},
{title:"Mall Slip-and-Fall Incident",icon:"🛍️💧🤕",text:"A customer slips on a wet floor and is injured.",correct:1,choices:["Clean the floor and record nothing.","Provide medical assistance, report to management, document the scene, and follow insurance procedures.","Ask the customer to leave.","Wait until the next day."]},
{title:"Water Leak at Home",icon:"🏠💧🛋️",text:"A major water leak damages furniture and walls.",correct:2,choices:["Leave the water running.","Throw damaged items away before photos.","Shut off the water, prevent further damage if safe, document it, and contact the insurer.","Only repaint the wall."]}];
let emergencyCurrent=null;
function startEmergency(){emergencyCurrent=emergencies[Math.floor(Math.random()*emergencies.length)];show("emergency");startTimer("emergencyTimer",()=>finishLevel3(false,"Time is up!"));$("#emergencyContent").innerHTML=`<div class="emoji-clue">${emergencyCurrent.icon}</div><h3>${emergencyCurrent.title}</h3><p>${emergencyCurrent.text}</p><div class="quiz-options">${emergencyCurrent.choices.map((x,i)=>`<button class="option" data-answer="${i}">${x}</button>`).join("")}</div>`;$("#emergencyContent").querySelectorAll(".option").forEach(b=>b.onclick=()=>finishLevel3(+b.dataset.answer===emergencyCurrent.correct,+b.dataset.answer===emergencyCurrent.correct?"Correct!":"That was not the safest response."))}
function startTimer(id,onEnd){clearInterval(state.timer);let d=getDifficulty();state.timeLeft=d.time;$("#"+id).textContent=state.timeLeft+"s";state.timer=setInterval(()=>{state.timeLeft--;let el=$("#"+id);if(el)el.textContent=state.timeLeft+"s";if(state.timeLeft<=0){clearInterval(state.timer);onEnd()}},1000)}
function finishLevel3(passed,message){
 clearInterval(state.timer);
 if(passed){
   const points={easy:10000,medium:20000,hard:30000}[state.difficulty]||20000;
   state.score+=points;
 }
 saveScore();
 show("finish");
 $("#finishTitle").textContent=passed?"CHALLENGE COMPLETED!":"CHALLENGE FINISHED";
 $("#finishMessage").innerHTML=`${message}<br><br><strong class="gift-message">Back to GIG representative to receive your gift</strong>`;
 $("#finalScore").textContent=state.score.toLocaleString();
 const b=$('[data-action="new-player"], [data-action="play-again"], [data-action="continue-result"]');
 b.textContent="PLAY AGAIN";
 b.dataset.action="play-again";
 b.onclick=()=>{
   clearInterval(state.timer);
   $("#playerName").value="";
   $("#playerPhone").value="";
   if($("#phoneError")) $("#phoneError").classList.add("hidden");
   state={name:"",phone:"",score:0,level:1,difficulty:"medium",timer:null,timeLeft:0,level2Passed:false};
   show("welcome");
 };
}
function showResult(title,msg,button,action){
 show("finish");
 $("#finishTitle").textContent=title;
 $("#finishMessage").textContent=msg;
 $("#finalScore").textContent=state.score.toLocaleString();
 const b=$('[data-action="new-player"], [data-action="play-again"], [data-action="continue-result"]');
 b.textContent=button;
 b.dataset.action="continue-result";
 b.onclick=action;
}
function saveScore(won){let scores=JSON.parse(localStorage.getItem("gigChallengeScores")||"[]");scores.push({name:state.name,phone:state.phone,score:state.score,won,date:new Date().toLocaleString()});scores.sort((a,b)=>b.score-a.score);localStorage.setItem("gigChallengeScores",JSON.stringify(scores))}
function renderLeaderboard(){let scores=JSON.parse(localStorage.getItem("gigChallengeScores")||"[]");$("#leaderboardList").innerHTML=scores.length?scores.map((s,i)=>`<div class="leader-row"><strong>#${i+1}</strong><span>${escapeHTML(s.name)}</span><strong>${Number(s.score).toLocaleString()}</strong></div>`).join(""):"<p>No scores saved yet.</p>";show("leaderboard")}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function getScores(){return JSON.parse(localStorage.getItem("gigChallengeScores")||"[]")}
function timestampedName(ext){const d=new Date(),p=n=>String(n).padStart(2,"0");return `GIG-Egypt-Challenge-Scores_${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.${ext}`}
function downloadBlob(content,type,filename){let blob=new Blob([content],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href)}
function buildCSV(scores){let rows=[["Rank","Name","Phone","Score","Won","Date"],...scores.map((s,i)=>[i+1,s.name,s.phone,s.score,s.won?"Yes":"No",s.date])];return rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n")}
function buildJSON(scores){return JSON.stringify(scores.map((s,i)=>({rank:i+1,name:s.name,phone:s.phone,score:s.score,won:!!s.won,date:s.date})),null,2)}
function exportCSV(){downloadBlob(buildCSV(getScores()),"text/csv",timestampedName("csv"))}
function exportJSON(){downloadBlob(buildJSON(getScores()),"application/json",timestampedName("json"))}

// ---------- Admin panel (PIN-protected) ----------
const ADMIN_PIN="2580"; // change this before your event
let adminTapCount=0,adminTapFirst=0;
function handleAdminTap(){
  const now=Date.now();
  if(now-adminTapFirst>3000){adminTapFirst=now;adminTapCount=1}else{adminTapCount++}
  if(adminTapCount>=5){adminTapCount=0;openPinModal()}
}
function openPinModal(){$("#pinInput").value="";$("#pinError").classList.add("hidden");$("#pinModal").classList.remove("hidden");$("#pinInput").focus()}
function closePinModal(){$("#pinModal").classList.add("hidden")}
function submitPin(){
  if($("#pinInput").value===ADMIN_PIN){closePinModal();renderAdmin()}
  else{$("#pinError").classList.remove("hidden")}
}
function renderAdmin(){
  const scores=getScores();
  $("#adminRecordCount").textContent=`${scores.length} player record(s) on this device/browser`;
  $("#adminList").innerHTML=scores.length?scores.map((s,i)=>`<div class="leader-row admin-row-item"><strong>#${i+1}</strong><span>${escapeHTML(s.name)}<br><small>${escapeHTML(s.phone)}</small></span><span>${escapeHTML(s.date)}</span><strong>${Number(s.score).toLocaleString()}</strong></div>`).join(""):"<p>No scores saved yet.</p>";
  show("adminScreen");
}
function resetCurrent(){clearInterval(state.timer);if(confirm("Reset the current game?")){state.score=0;$("#playerName").value="";$("#playerPhone").value="";show("welcome")}}
document.addEventListener("click",e=>{
 const action=e.target.closest("[data-action]")?.dataset.action;
 if(action==="start") startGame();
 if(action==="new-player") location.reload();
 if(action==="leaderboard") renderLeaderboard();
 if(action==="close-leaderboard") show("welcome");
 if(action==="reset") resetCurrent();
 if(action==="export") exportCSV();
 if(action==="clear-scores"&&confirm("Delete all saved scores from this device/browser?")){localStorage.removeItem("gigChallengeScores");renderAdmin()}
 if(action==="admin-export-csv") exportCSV();
 if(action==="admin-export-json") exportJSON();
 if(action==="close-admin") show("welcome");
 if(action==="pin-submit") submitPin();
 if(action==="pin-cancel") closePinModal();
 // continue-result and play-again use their own onclick handlers.
 const game=e.target.closest("[data-game]")?.dataset.game;
 if(game==="suitcase") startSuitcase();
 if(game==="risk") startRisk();
 if(game==="emoji") startEmoji();
 if(game==="emergency") startEmergency();
});
$("#spinBtn").addEventListener("click",spin);$("#startLevelBtn").addEventListener("click",openLevel);

$("#physicalJengaDone").addEventListener("click",()=>show("level2Menu"));
$("#playerPhone").addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,11);$("#phoneError").classList.add("hidden")});

// Hidden admin access: tap/click the header logo 5 times within 3 seconds.
$("#brandLogo").addEventListener("click",handleAdminTap);
$("#pinInput").addEventListener("keydown",e=>{if(e.key==="Enter")submitPin();if(e.key==="Escape")closePinModal()});
