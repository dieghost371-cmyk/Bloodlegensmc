// Firebase-ready BloodLegensMC site. Add your Firebase web config below.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyDIaT4VD2rzaGqsDv_RxGm_IYnX4OiJeXA',authDomain:'bloodlegen-5e51c.firebaseapp.com',projectId:'bloodlegen-5e51c',storageBucket:'bloodlegen-5e51c.firebasestorage.app',messagingSenderId:'130652097903',appId:'1:130652097903:web:e6fbbca95927cbe5486c9a',measurementId:'G-1Y2V69S719'};
const configured=!firebaseConfig.apiKey.startsWith('PASTE_');
let auth,db,currentUser;
if(configured){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);}
const $=id=>document.getElementById(id);
function localVotes(){return JSON.parse(localStorage.getItem('bl_votes')||'[]')}
function renderVotes(v){$('voteList').innerHTML=v.length?v.slice(0,20).map(x=>`<div class="voteItem"><b>${escapeHtml(x.name)}</b><span>✓ voted</span></div>`).join(''):'<p class="muted">No votes yet.</p>'}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
renderVotes(localVotes());
$('voteBtn').onclick=async()=>{const name=$('mcName').value.trim();if(!name){$('voteMsg').textContent='Enter your Minecraft name first.';return}if(configured&&currentUser){try{await addDoc(collection(db,'votes'),{name,userId:currentUser.uid,createdAt:serverTimestamp()});$('voteMsg').textContent='Vote recorded!';}catch(e){$('voteMsg').textContent='Could not save vote: '+e.message}}else{const v=localVotes();v.unshift({name});localStorage.setItem('bl_votes',JSON.stringify(v));renderVotes(v);$('voteMsg').textContent=configured?'Login with Google to sync votes publicly.':'Demo vote saved on this device. Add Firebase config to make votes public.'}$('mcName').value=''};
function login(){if(!configured){alert('Google Login is ready, but the Firebase config has not been added yet. Open README.txt and follow the setup steps.');return}signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>alert(e.message))}
$('loginBtn').onclick=login;$('loginBtn2').onclick=login;
function renderMessages(snap){$('messages').innerHTML='';snap.forEach(d=>{const x=d.data();$('messages').innerHTML+=`<div class="message"><b>${escapeHtml(x.name||'Member')}</b> <small>${x.createdAt?.toDate?x.createdAt.toDate().toLocaleTimeString():''}</small><div>${escapeHtml(x.text||'')}</div></div>`})}
if(configured){onAuthStateChanged(auth,u=>{currentUser=u;if(u){$('userInfo').innerHTML=`<p>Signed in as <b>${escapeHtml(u.displayName||u.email)}</b></p>`;$('chatText').disabled=false;$('sendBtn').disabled=false;$('loginBtn').textContent='Signed in';$('loginBtn2').textContent='Signed in with Google'}else{$('userInfo').innerHTML='';$('chatText').disabled=true;$('sendBtn').disabled=true}});onSnapshot(query(collection(db,'votes'),orderBy('createdAt','desc'),limit(30)),renderVotesFromFirebase=>{const v=[];renderVotesFromFirebase.forEach(d=>v.push(d.data()));renderVotes(v)});onSnapshot(query(collection(db,'messages'),orderBy('createdAt','asc'),limit(100)),renderMessages)}
$('sendBtn').onclick=async()=>{if(!currentUser)return;const text=$('chatText').value.trim();if(!text)return;await addDoc(collection(db,'messages'),{text,name:currentUser.displayName||currentUser.email,uid:currentUser.uid,createdAt:serverTimestamp()});$('chatText').value=''};
$('chatText').addEventListener('keydown',e=>{if(e.key==='Enter')$('sendBtn').click()});
