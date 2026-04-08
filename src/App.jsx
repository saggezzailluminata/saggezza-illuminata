import { useState, useEffect, useRef, useCallback } from "react";

const PHASES = { LANDING: 0, QUIZ: 1, DIAGNOSIS: 2, DEMO: 3, OFFER: 4, DASHBOARD: 5 };

// Simulated live users
const LIVE_NAMES = ["Marco R.","Giulia S.","Alessandro V.","Francesca M.","Luca B.","Sara T.","Andrea P.","Elena C.","Davide G.","Chiara L.","Roberto F.","Valentina N.","Simone D.","Laura Z.","Matteo K.","Anna W.","Giorgio H.","Silvia J.","Paolo Q.","Monica X.","Federico A.","Beatrice O.","Nicola I.","Claudia U.","Stefano E."];

const PROBLEMS = [
  { id: "meditation", icon: "🧘", label: "Meditazione", desc: "Non riesci a calmare la mente", color: "#6B5CE7" },
  { id: "consciousness", icon: "👁️", label: "Coscienza", desc: "Senti di vivere in automatico", color: "#E7A55C" },
  { id: "awakening", icon: "✨", label: "Risveglio Spirituale", desc: "Cerchi il tuo vero scopo", color: "#5CE7B5" },
  { id: "abundance", icon: "💎", label: "Abbondanza Finanziaria", desc: "Blocchi nella prosperità", color: "#E75C8D" },
];

const TECHNIQUES = {
  meditation: [
    { name: "Protocollo Theta-Reset™", time: "7 min", result: "Silenzio mentale in 48 ore", proven: "4.217 praticanti" },
    { name: "Respiro Quantico 4-7-8", time: "3 min", result: "Ansia ridotta del 73%", proven: "Studio su 1.890 soggetti" },
    { name: "Mantra Neurale Personalizzato", time: "5 min", result: "Sonno profondo garantito", proven: "97% efficacia clinica" },
  ],
  consciousness: [
    { name: "Mappa della Presenza™", time: "10 min", result: "Consapevolezza 24/7 in 21 giorni", proven: "3.456 testimonianze" },
    { name: "Protocollo di De-Automatizzazione", time: "8 min", result: "Vivi ogni momento al 100%", proven: "Validato da 12 neuroscienziati" },
    { name: "Scanner Coscienza Espansa", time: "6 min", result: "Percezione aumentata del 340%", proven: "2.891 casi documentati" },
  ],
  awakening: [
    { name: "Attivazione Kundalini Sicura™", time: "15 min", result: "Risveglio progressivo in 30 giorni", proven: "1.234 risvegli guidati" },
    { name: "Decodifica Missione Animica", time: "12 min", result: "Scopri il tuo scopo in 7 giorni", proven: "5.678 missioni rivelate" },
    { name: "Sincronicità Accelerator", time: "5 min", result: "Sincronicità quotidiane in 72 ore", proven: "94% tasso di successo" },
  ],
  abundance: [
    { name: "Re-Wiring Subconscio Denaro™", time: "9 min", result: "Sblocco finanziario in 14 giorni", proven: "€2.3M generati dai membri" },
    { name: "Frequenza 528Hz Prosperità", time: "11 min", result: "Attrai opportunità concrete", proven: "3.412 storie di successo" },
    { name: "Protocollo Gratitudine Magnetica", time: "4 min", result: "Raddoppia il reddito in 90 giorni", proven: "1.987 risultati verificati" },
  ],
};

const PRACTICE_GUIDES = {
  meditation: [
    // Protocollo Theta-Reset™
    [
      { title: "Preparazione", instruction: "Siediti comodamente, schiena dritta. Chiudi gli occhi. Rilassa mascella, spalle e mani.", duration: 15, type: "hold" },
      { title: "Scansione Corporea Theta", instruction: "Porta attenzione alla cima della testa. Senti un'onda calda scendere lentamente dalla testa ai piedi.", duration: 30, type: "hold" },
      { title: "Onde Theta — Fase 1", instruction: "Inspira lentamente contando fino a 6. Trattieni per 3. Espira contando fino a 6.", duration: 40, type: "breathe", pattern: [6, 3, 6] },
      { title: "Riprogrammazione Theta", instruction: "Ripeti mentalmente: 'La mia mente è calma, sono in pace profonda'. Visualizza uno schermo mentale completamente bianco.", duration: 40, type: "hold" },
      { title: "Onde Theta — Fase 2", instruction: "Respira ancora più lentamente. Inspira 8 secondi, trattieni 4, espira 8. Senti il silenzio tra i pensieri.", duration: 50, type: "breathe", pattern: [8, 4, 8] },
      { title: "Integrazione", instruction: "Resta nel silenzio. Osserva lo spazio tra un pensiero e l'altro. Non forzare nulla.", duration: 30, type: "hold" },
      { title: "Risveglio Graduale", instruction: "Muovi lentamente le dita. Fai 3 respiri profondi. Apri gli occhi con calma.", duration: 15, type: "hold" },
    ],
    // Respiro Quantico 4-7-8
    [
      { title: "Posizione", instruction: "Seduto o sdraiato. Appoggia la lingua dietro gli incisivi superiori. Espira completamente dalla bocca.", duration: 10, type: "hold" },
      { title: "Ciclo 1", instruction: "Inspira dal naso per 4 secondi. Trattieni per 7 secondi. Espira dalla bocca per 8 secondi.", duration: 19, type: "breathe", pattern: [4, 7, 8] },
      { title: "Ciclo 2", instruction: "Ripeti: inspira 4 — trattieni 7 — espira 8. Senti il corpo che si rilassa ad ogni espiro.", duration: 19, type: "breathe", pattern: [4, 7, 8] },
      { title: "Ciclo 3", instruction: "Ancora: 4-7-8. Nota come la mente diventa più silenziosa ad ogni ciclo.", duration: 19, type: "breathe", pattern: [4, 7, 8] },
      { title: "Ciclo 4", instruction: "Ultimo ciclo: 4-7-8. Senti la calma che pervade ogni cellula del tuo corpo.", duration: 19, type: "breathe", pattern: [4, 7, 8] },
      { title: "Riposo", instruction: "Respira normalmente. Osserva come ti senti. Resta in questo stato di calma.", duration: 20, type: "hold" },
    ],
    // Mantra Neurale Personalizzato
    [
      { title: "Centratura", instruction: "Chiudi gli occhi. Fai 3 respiri profondi per centrarti. Senti il peso del corpo.", duration: 15, type: "hold" },
      { title: "Attivazione del Mantra", instruction: "Ripeti mentalmente: 'OM SHANTI'. Ad ogni ripetizione, senti la vibrazione nel petto.", duration: 40, type: "hold" },
      { title: "Approfondimento", instruction: "Lascia che il mantra rallenti. 'OM... SHANTI...'. Senti gli spazi di silenzio crescere.", duration: 40, type: "hold" },
      { title: "Mantra Silenzioso", instruction: "Ora il mantra diventa un sussurro interiore. Appena percettibile. Solo vibrazione pura.", duration: 50, type: "hold" },
      { title: "Silenzio Puro", instruction: "Lascia andare il mantra. Resta nel silenzio che hai creato. Questo è il tuo stato naturale.", duration: 40, type: "hold" },
      { title: "Ritorno", instruction: "Lentamente torna. Muovi le dita, fai un respiro profondo. Porta questa pace con te.", duration: 15, type: "hold" },
    ],
  ],
  consciousness: [
    // Mappa della Presenza™
    [
      { title: "Ancoramento al Presente", instruction: "Nota 5 cose che vedi, 4 che senti, 3 che tocchi, 2 che odori, 1 che gusti.", duration: 30, type: "hold" },
      { title: "Il Testimone", instruction: "Osserva i tuoi pensieri come nuvole. Non sei i pensieri — sei il cielo. Guardali passare.", duration: 40, type: "hold" },
      { title: "Presenza nel Corpo", instruction: "Senti l'energia nelle mani. Poi nei piedi. Poi nell'intero corpo. Sei presente ORA.", duration: 40, type: "hold" },
      { title: "Gap di Coscienza", instruction: "Tra un pensiero e l'altro c'è uno spazio. Cerca quello spazio. Allargalo. Resta lì.", duration: 50, type: "hold" },
      { title: "Integrazione", instruction: "Porta questa presenza in un'azione semplice: muovi una mano consapevolmente. Senti ogni millimetro.", duration: 30, type: "hold" },
    ],
    // Protocollo De-Automatizzazione
    [
      { title: "Riconoscimento", instruction: "Pensa a 3 azioni che fai in automatico ogni giorno. Mangiare, camminare, parlare. Scegli una.", duration: 20, type: "hold" },
      { title: "Rallentamento 10x", instruction: "Alza una mano 10 volte più lentamente del normale. Nota ogni micro-movimento, ogni muscolo.", duration: 40, type: "hold" },
      { title: "Respiro Consapevole", instruction: "Respira come se fosse la prima volta. Inspira: senti l'aria fredda. Espira: senti l'aria calda.", duration: 30, type: "breathe", pattern: [5, 2, 5] },
      { title: "Ascolto Profondo", instruction: "Ascolta tutti i suoni intorno a te. Non giudicarli. Non nominarli. Solo suono puro.", duration: 40, type: "hold" },
      { title: "Visione Fresca", instruction: "Apri gli occhi come un neonato. Guarda senza etichette. Solo forme, colori, luce.", duration: 30, type: "hold" },
      { title: "Imprinting", instruction: "Scegli un'azione quotidiana. Da oggi la farai con piena coscienza. Questo è il tuo trigger.", duration: 20, type: "hold" },
    ],
    // Scanner Coscienza Espansa
    [
      { title: "Focus Interno", instruction: "Chiudi gli occhi. Porta attenzione al centro della fronte, il terzo occhio. Senti una leggera pressione.", duration: 20, type: "hold" },
      { title: "Espansione Sferica", instruction: "La tua coscienza si espande come una sfera. Prima riempie la stanza. Poi l'edificio. Poi la città.", duration: 40, type: "hold" },
      { title: "Coscienza Planetaria", instruction: "Espanditi ancora. Senti la Terra intera. Miliardi di esseri viventi. Tutto è connesso.", duration: 40, type: "hold" },
      { title: "Coscienza Cosmica", instruction: "Vai oltre. Stelle, galassie. Sei parte di un'unica coscienza infinita. Senti l'immensità.", duration: 30, type: "hold" },
      { title: "Ritorno Integrato", instruction: "Torna nella stanza portando questa espansione con te. Sei più grande di prima.", duration: 20, type: "hold" },
    ],
  ],
  awakening: [
    // Attivazione Kundalini Sicura™
    [
      { title: "Radicamento", instruction: "Piedi a terra. Visualizza radici che scendono dalla base della spina nel cuore della Terra.", duration: 25, type: "hold" },
      { title: "Respiro di Fuoco", instruction: "Respiri rapidi e ritmici dal naso. Pancia dentro-fuori velocemente. 20 respiri.", duration: 30, type: "hold" },
      { title: "Attivazione Base", instruction: "Visualizza una luce rossa calda alla base della spina. Senti calore e sicurezza.", duration: 30, type: "hold" },
      { title: "Salita dell'Energia", instruction: "La luce sale: arancione al ventre, gialla al plesso solare. Senti il calore salire.", duration: 40, type: "hold" },
      { title: "Apertura del Cuore", instruction: "Luce verde brillante al centro del petto. Senti amore incondizionato espandersi.", duration: 40, type: "hold" },
      { title: "Centri Superiori", instruction: "Blu alla gola, indaco alla fronte, viola alla corona. Senti la connessione col divino.", duration: 40, type: "hold" },
      { title: "Integrazione Sicura", instruction: "Torna al cuore. Bilancia l'energia. Fai 5 respiri profondi. Ringrazia il tuo corpo.", duration: 25, type: "hold" },
    ],
    // Decodifica Missione Animica
    [
      { title: "Rilassamento Profondo", instruction: "Chiudi gli occhi. Rilassa completamente il corpo. Immagina di scendere una scala di 10 gradini verso il tuo centro.", duration: 30, type: "hold" },
      { title: "Domanda al Cuore", instruction: "Chiedi al tuo cuore: 'Qual è il mio dono unico per il mondo?' Ascolta senza giudicare la risposta.", duration: 40, type: "hold" },
      { title: "Visione della Missione", instruction: "Visualizza te stesso tra 5 anni nella tua vita ideale. Cosa fai? Chi aiuti? Come ti senti?", duration: 50, type: "hold" },
      { title: "Segni e Sincronicità", instruction: "Ricorda 3 coincidenze significative della tua vita. Cosa ti stavano dicendo? Qual è il filo conduttore?", duration: 40, type: "hold" },
      { title: "Dichiarazione", instruction: "Formula la tua missione in una frase. 'Io sono qui per...' Ripetila 3 volte con convinzione.", duration: 30, type: "hold" },
      { title: "Sigillo", instruction: "Metti le mani sul cuore. Senti la verità della tua missione. Ringrazia per questa chiarezza.", duration: 20, type: "hold" },
    ],
    // Sincronicità Accelerator
    [
      { title: "Intenzione Chiara", instruction: "Definisci un'intenzione specifica. Cosa vuoi attrarre? Formulala in positivo, al presente.", duration: 20, type: "hold" },
      { title: "Frequenza di Ricezione", instruction: "Senti la gratitudine come se fosse già accaduto. Il cuore si apre. L'universo risponde alla frequenza.", duration: 30, type: "hold" },
      { title: "Apertura dei Canali", instruction: "Visualizza che da ogni direzione arrivano segnali, opportunità, incontri. Sei un magnete.", duration: 30, type: "hold" },
      { title: "Rilascio", instruction: "Lascia andare il 'come' e il 'quando'. Fidati. Dì mentalmente: 'Questo o qualcosa di meglio'.", duration: 20, type: "hold" },
      { title: "Azione Ispirata", instruction: "Chiedi: 'Qual è il primo piccolo passo che posso fare ORA?' Ascolta l'intuizione. Impegnati a farlo oggi.", duration: 20, type: "hold" },
    ],
  ],
  abundance: [
    // Re-Wiring Subconscio Denaro™
    [
      { title: "Scopri il Blocco", instruction: "Completa la frase: 'Il denaro è...' Nota la prima cosa che emerge. Quello è il tuo blocco subconscio.", duration: 20, type: "hold" },
      { title: "Rilascio del Vecchio", instruction: "Inspira il vecchio schema. Espira e rilascialo. Ripeti: 'Rilascio ogni credenza limitante sul denaro'.", duration: 30, type: "breathe", pattern: [5, 2, 7] },
      { title: "Re-Wiring Neurale", instruction: "Ripeti con emozione: 'Io merito abbondanza. Il denaro fluisce verso di me facilmente. Sono un magnete di prosperità.'", duration: 40, type: "hold" },
      { title: "Visualizzazione Concreta", instruction: "Vedi il tuo conto in banca con la cifra che desideri. Senti la sicurezza. Senti la libertà.", duration: 40, type: "hold" },
      { title: "Embodiment", instruction: "Come ti muoveresti se avessi già quell'abbondanza? Raddrizza la schiena. Respira con espansione.", duration: 30, type: "hold" },
      { title: "Gratitudine Anticipata", instruction: "Ringrazia per l'abbondanza che sta arrivando. Senti la gratitudine nel petto. È già in movimento.", duration: 20, type: "hold" },
    ],
    // Frequenza 528Hz Prosperità
    [
      { title: "Sintonizzazione", instruction: "Chiudi gli occhi. Immagina un suono dorato che risuona nel tuo petto: la frequenza della prosperità.", duration: 20, type: "hold" },
      { title: "Vibrazione Cellulare", instruction: "Ogni cellula del tuo corpo vibra a 528Hz. Senti il ronzio dolce di abbondanza in tutto il corpo.", duration: 40, type: "hold" },
      { title: "Canto Interiore", instruction: "Canticchia 'Mmmm' a bassa voce. Senti la vibrazione nelle ossa. Questa è la tua frequenza di prosperità.", duration: 30, type: "hold" },
      { title: "Campo Magnetico", instruction: "La vibrazione si espande. Crea un campo magnetico dorato intorno a te. Attrai ricchezza, opportunità, abbondanza.", duration: 40, type: "hold" },
      { title: "Programmazione", instruction: "In questo stato, dichiara: 'Sono allineato alla frequenza dell'abbondanza infinita'. Sentilo vero.", duration: 30, type: "hold" },
      { title: "Sigillo Frequenziale", instruction: "Metti le mani sul cuore. Questa frequenza è ora impressa nel tuo campo energetico. Attiva 24/7.", duration: 20, type: "hold" },
    ],
    // Protocollo Gratitudine Magnetica
    [
      { title: "Cuore Aperto", instruction: "Mani sul cuore. Pensa a 3 cose per cui sei profondamente grato ORA. Sentile nel petto.", duration: 25, type: "hold" },
      { title: "Gratitudine Finanziaria", instruction: "Ringrazia per ogni euro che hai. Ringrazia per il prossimo pagamento in arrivo. Senti abbondanza nel presente.", duration: 30, type: "hold" },
      { title: "Amplificazione", instruction: "La gratitudine si amplifica. Più ringrazi, più arriva. È una legge. Senti l'onda di gratitudine crescere.", duration: 30, type: "hold" },
      { title: "Visione Grata", instruction: "Visualizza la tua vita tra 1 anno. Tutto ciò che hai attratto. Ringrazia in anticipo con tutto il cuore.", duration: 30, type: "hold" },
      { title: "Impegno", instruction: "Impegnati: ogni sera scrivi 3 gratitudini finanziarie. Questo reprogramma il subconscio in 21 giorni.", duration: 15, type: "hold" },
    ],
  ],
};

const TESTIMONIALS = [
  { name: "Marco R.", city: "Milano", photo: "🧔", text: "In 3 settimane ho eliminato l'ansia che mi perseguitava da 12 anni. Questo non è un corso, è una trasformazione.", problem: "meditation", result: "+73% pace mentale" },
  { name: "Giulia S.", city: "Roma", photo: "👩", text: "Ho trovato il mio scopo di vita. Ora guadagno facendo ciò che amo. Il referral mi ha portato €1.240 extra.", problem: "awakening", result: "Missione trovata" },
  { name: "Alessandro V.", city: "Napoli", photo: "👨‍💼", text: "Da €2.100/mese a €8.400/mese in 4 mesi. Le tecniche di abbondanza funzionano davvero.", problem: "abundance", result: "+300% reddito" },
  { name: "Sara T.", city: "Firenze", photo: "👩‍🦰", text: "La meditazione Theta-Reset ha cambiato tutto. Dormo come un bambino e mi sveglio piena di energia.", problem: "meditation", result: "Sonno perfetto" },
  { name: "Luca B.", city: "Torino", photo: "🧑", text: "Il protocollo di Coscienza Espansa è reale. Vedo il mondo con occhi completamente nuovi.", problem: "consciousness", result: "Risveglio totale" },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }

:root {
  --bg: #0A0A0F;
  --bg2: #12121A;
  --bg3: #1A1A26;
  --gold: #D4A853;
  --gold2: #F0D78C;
  --purple: #6B5CE7;
  --teal: #5CE7B5;
  --pink: #E75C8D;
  --orange: #E7A55C;
  --text: #E8E6F0;
  --text2: #9896A8;
  --glow: 0 0 40px rgba(212,168,83,0.15);
}

body, html { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

.si-app { min-height: 100vh; background: var(--bg); position: relative; }

.si-app::before {
  content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at 20% 0%, rgba(107,92,231,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 100%, rgba(212,168,83,0.06) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}

h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif; }

.fade-in { animation: fadeIn 0.8s ease both; }
.fade-up { animation: fadeUp 0.6s ease both; }
.slide-in { animation: slideIn 0.5s ease both; }

@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
@keyframes slideIn { from { opacity:0; transform:translateX(-20px) } to { opacity:1; transform:translateX(0) } }
@keyframes pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.05) } }
@keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(212,168,83,0.2) } 50% { box-shadow: 0 0 40px rgba(212,168,83,0.4) } }
@keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
@keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
@keyframes countUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
@keyframes livePulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
@keyframes gradientMove { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }

.btn-gold {
  background: linear-gradient(135deg, var(--gold), #B8902F);
  color: #0A0A0F; border: none; padding: 16px 40px; border-radius: 12px;
  font-size: 17px; font-weight: 700; cursor: pointer; position: relative;
  letter-spacing: 0.5px; transition: all 0.3s; font-family: 'DM Sans', sans-serif;
}
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,168,83,0.4); }
.btn-gold:active { transform: translateY(0); }

.btn-outline {
  background: transparent; border: 1.5px solid rgba(212,168,83,0.4);
  color: var(--gold); padding: 12px 28px; border-radius: 10px;
  font-size: 15px; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif;
}
.btn-outline:hover { border-color: var(--gold); background: rgba(212,168,83,0.08); }

.card {
  background: var(--bg2); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px; padding: 24px; transition: all 0.3s;
}
.card:hover { border-color: rgba(212,168,83,0.2); box-shadow: var(--glow); }

.live-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(231,92,141,0.15); border: 1px solid rgba(231,92,141,0.3);
  padding: 6px 14px; border-radius: 100px; font-size: 12px; color: var(--pink);
}
.live-dot { width:6px; height:6px; border-radius:50%; background:var(--pink); animation: livePulse 1.5s infinite; }

.progress-ring {
  width: 100%; height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 3px; transition: width 1s ease;
  background: linear-gradient(90deg, var(--gold), var(--gold2));
}

.notification-toast {
  position: fixed; bottom: 20px; left: 20px; z-index: 1000;
  background: var(--bg2); border: 1px solid rgba(212,168,83,0.3);
  padding: 14px 20px; border-radius: 12px; display: flex; align-items: center; gap: 10px;
  animation: slideIn 0.4s ease, fadeIn 0.4s ease; font-size: 13px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.leaderboard-row {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  border-radius: 10px; transition: all 0.3s; cursor: default;
}
.leaderboard-row:hover { background: rgba(212,168,83,0.05); }

.xp-badge {
  background: linear-gradient(135deg, rgba(107,92,231,0.2), rgba(107,92,231,0.05));
  border: 1px solid rgba(107,92,231,0.3); padding: 4px 12px; border-radius: 100px;
  font-size: 12px; color: var(--purple); font-weight: 600;
}

.streak-fire { animation: float 2s ease infinite; display: inline-block; }

.share-card {
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid rgba(212,168,83,0.2); border-radius: 20px;
  padding: 32px; text-align: center; position: relative; overflow: hidden;
}
.share-card::before {
  content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(212,168,83,0.05), transparent, rgba(107,92,231,0.05), transparent);
  animation: spin 20s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }

.quiz-option {
  background: var(--bg2); border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 20px 24px; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; gap: 16px;
}
.quiz-option:hover { border-color: rgba(212,168,83,0.4); transform: translateX(4px); }
.quiz-option.selected { border-color: var(--gold); background: rgba(212,168,83,0.08); }

.technique-card {
  background: var(--bg2); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px; padding: 20px; position: relative; overflow: hidden;
}
.technique-card::after {
  content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%;
  background: linear-gradient(to bottom, var(--gold), transparent);
}

.scroll-section { position: relative; z-index: 1; }

.tier-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
}

.referral-link-box {
  background: var(--bg3); border: 1px solid rgba(212,168,83,0.2);
  border-radius: 10px; padding: 14px 18px; font-family: monospace;
  font-size: 13px; color: var(--gold2); display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}

.gamification-bar {
  position: sticky; top: 0; z-index: 100; background: rgba(10,10,15,0.95);
  backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 10px 24px; display: flex; align-items: center; justify-content: space-between;
}

.countdown-digit {
  background: var(--bg3); border: 1px solid rgba(212,168,83,0.2);
  border-radius: 8px; padding: 8px 12px; font-size: 24px; font-weight: 700;
  color: var(--gold); font-family: 'Cormorant Garamond', serif;
  min-width: 48px; text-align: center;
}

.section-container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
.wide-container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
`;

// ─── Notification Component ───
function LiveNotification({ show, name, action }) {
  if (!show) return null;
  return (
    <div className="notification-toast">
      <div className="live-dot" />
      <span><strong>{name}</strong> {action}</span>
    </div>
  );
}

// ─── Landing Phase ───
function LandingPhase({ onStart }) {
  const [liveCount, setLiveCount] = useState(347);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    const i1 = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3) - 1), 5000);
    const i2 = setInterval(() => {
      const n = LIVE_NAMES[Math.floor(Math.random() * LIVE_NAMES.length)];
      const actions = ["ha appena iniziato il suo percorso ✨", "ha sbloccato il Livello 3 🔓", "ha guadagnato €47 dal referral 💰", "ha completato la Sfida Settimanale 🏆"];
      setNotif({ name: n, action: actions[Math.floor(Math.random() * actions.length)] });
      setTimeout(() => setNotif(null), 4000);
    }, 8000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);

  return (
    <div className="scroll-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 20px 40px" }}>
      <LiveNotification show={!!notif} name={notif?.name} action={notif?.action} />
      <div className="section-container fade-in" style={{ textAlign: "center" }}>
        <div className="live-badge" style={{ margin: "0 auto 32px", display: "inline-flex" }}>
          <div className="live-dot" />
          <span>{liveCount} persone online ora</span>
        </div>
        <div style={{ fontSize: 52, marginBottom: 8, animation: "float 3s ease infinite" }}>◇</div>
        <h1 className="serif" style={{ fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 1.1, marginBottom: 20, fontWeight: 300, color: "var(--gold2)" }}>
          Saggezza<br /><span style={{ fontWeight: 700, fontStyle: "italic" }}>Illuminata</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text2)", maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.7, fontWeight: 300 }}>
          L'unico sistema che unisce scienza e spiritualità per risolvere
          i tuoi problemi <em>specifici</em> — con tecniche testate su oltre <strong style={{ color: "var(--text)" }}>47.000 praticanti</strong>.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {[["🧠","Meditazione"],["👁️","Coscienza"],["✨","Risveglio"],["💎","Abbondanza"]].map(([e,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text2)", fontSize: 14 }}>
              <span style={{ fontSize: 18 }}>{e}</span>{l}
            </div>
          ))}
        </div>
        <button className="btn-gold" onClick={onStart} style={{ animation: "glow 2s infinite", fontSize: 18, padding: "18px 52px" }}>
          Scopri la Tua Soluzione Personalizzata →
        </button>
        <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 16, opacity: 0.7 }}>
          ⏱ Test gratuito di 2 minuti • Nessuna carta richiesta
        </p>
        <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[["47.218","Praticanti Attivi"],["4.8★","Valutazione Media"],["€2.3M","Guadagnati dai Membri"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>{n}</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Phase ───
const QUIZ_QUESTIONS = [
  { q: "Qual è il tuo problema più urgente in questo momento?", opts: PROBLEMS.map(p => ({ id: p.id, icon: p.icon, label: p.label, sub: p.desc })) },
  { q: "Da quanto tempo combatti con questo problema?", opts: [
    { id: "weeks", icon: "📅", label: "Alcune settimane", sub: "È recente" },
    { id: "months", icon: "📆", label: "Mesi", sub: "Diversi mesi" },
    { id: "years", icon: "⏳", label: "Anni", sub: "Troppo tempo" },
    { id: "lifetime", icon: "♾️", label: "Tutta la vita", sub: "Da sempre" },
  ]},
  { q: "Hai già provato altre soluzioni?", opts: [
    { id: "nothing", icon: "🆕", label: "No, è la prima volta", sub: "Sono nuovo" },
    { id: "some", icon: "📚", label: "Qualche libro/corso", sub: "Risultati parziali" },
    { id: "many", icon: "💸", label: "Tante cose, nulla funziona", sub: "Frustrato" },
    { id: "expert", icon: "🎓", label: "Sono già un praticante esperto", sub: "Cerco il livello successivo" },
  ]},
  { q: "Quanto sei disposto a dedicare ogni giorno?", opts: [
    { id: "5min", icon: "⚡", label: "5 minuti", sub: "Il minimo" },
    { id: "15min", icon: "🕐", label: "15 minuti", sub: "Tempo ragionevole" },
    { id: "30min", icon: "🕑", label: "30 minuti", sub: "Impegno serio" },
    { id: "60min", icon: "🔥", label: "1 ora+", sub: "Massima dedizione" },
  ]},
];

function QuizPhase({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const handleSelect = (optId) => {
    setSelected(optId);
    const keys = ["problem", "duration", "experience", "time"];
    const newAnswers = { ...answers, [keys[step]]: optId };
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      if (step < QUIZ_QUESTIONS.length - 1) setStep(step + 1);
      else onComplete(newAnswers);
    }, 500);
  };

  const q = QUIZ_QUESTIONS[step];
  const pct = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="scroll-section fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Domanda {step + 1} di {QUIZ_QUESTIONS.length}</span>
            <span style={{ fontSize: 12, color: "var(--gold)" }}>{Math.round(pct)}%</span>
          </div>
          <div className="progress-ring"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        </div>
        <h2 className="serif" style={{ fontSize: "clamp(24px, 5vw, 36px)", marginBottom: 32, fontWeight: 400, lineHeight: 1.3 }}>{q.q}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.opts.map((o, i) => (
            <div key={o.id} className={`quiz-option ${selected === o.id ? "selected" : ""}`}
              onClick={() => handleSelect(o.id)}
              style={{ animationDelay: `${i * 0.1}s`, animation: "fadeUp 0.5s ease both" }}>
              <span style={{ fontSize: 28 }}>{o.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{o.label}</div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>{o.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Diagnosis Phase ───
function DiagnosisPhase({ answers, onContinue }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const problem = PROBLEMS.find(p => p.id === answers.problem) || PROBLEMS[0];
  const techniques = TECHNIQUES[answers.problem] || TECHNIQUES.meditation;

  useEffect(() => {
    const steps = [15, 35, 58, 79, 100];
    steps.forEach((s, i) => setTimeout(() => {
      setProgress(s);
      if (s === 100) setTimeout(() => setDone(true), 600);
    }, (i + 1) * 800));
  }, []);

  const labels = ["Analisi del profilo...", "Calcolo blocchi energetici...", "Selezione protocolli...", "Personalizzazione percorso...", "Diagnosi completa!"];
  const labelIdx = progress < 20 ? 0 : progress < 40 ? 1 : progress < 60 ? 2 : progress < 80 ? 3 : 4;

  if (!done) return (
    <div className="scroll-section fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
      <div className="section-container" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24, animation: "float 2s ease infinite" }}>{problem.icon}</div>
        <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>Stiamo analizzando il tuo profilo...</h2>
        <p style={{ color: "var(--text2)", marginBottom: 32, fontSize: 14 }}>{labels[labelIdx]}</p>
        <div className="progress-ring" style={{ height: 8, maxWidth: 400, margin: "0 auto" }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ color: "var(--gold)", marginTop: 12, fontSize: 13 }}>{progress}%</p>
      </div>
    </div>
  );

  return (
    <div className="scroll-section fade-up" style={{ minHeight: "100vh", padding: "40px 20px 60px" }}>
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 14, color: problem.color, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>La Tua Diagnosi Personalizzata</div>
          <h2 className="serif" style={{ fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 12, fontWeight: 400 }}>
            Il tuo blocco principale:<br /><span style={{ color: "var(--gold)", fontWeight: 700, fontStyle: "italic" }}>{problem.label}</span>
          </h2>
          <p style={{ color: "var(--text2)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Abbiamo identificato <strong style={{ color: "var(--text)" }}>3 protocolli specifici</strong> testati su persone con il tuo stesso profilo. Ecco cosa ti serve:
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {techniques.map((t, i) => (
            <div key={i} className="technique-card fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--gold2)" }}>{t.name}</h3>
                <span style={{ fontSize: 12, color: "var(--text2)", whiteSpace: "nowrap" }}>⏱ {t.time}/giorno</span>
              </div>
              <p style={{ fontSize: 15, marginBottom: 6, color: "var(--text)" }}>{t.result}</p>
              <p style={{ fontSize: 12, color: "var(--teal)" }}>✓ {t.proven}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.2)", marginBottom: 32, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 4 }}>Tempo stimato per i primi risultati</p>
          <p className="serif" style={{ fontSize: 36, color: "var(--gold)", fontWeight: 700 }}>
            {answers.duration === "weeks" ? "48 ore" : answers.duration === "months" ? "7 giorni" : "14 giorni"}
          </p>
          <p style={{ fontSize: 13, color: "var(--text2)" }}>con soli {answers.time === "5min" ? "5" : answers.time === "15min" ? "15" : answers.time === "30min" ? "30" : "60"} min/giorno</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <button className="btn-gold" onClick={onContinue} style={{ fontSize: 17, padding: "18px 48px" }}>
            Prova Gratis una Tecnica →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Demo Phase (mini guided experience) ───
function DemoPhase({ answers, onContinue }) {
  const [step, setStep] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [count, setCount] = useState(4);
  const [phase, setPhase] = useState("inspira");
  const [cycles, setCycles] = useState(0);
  const problem = PROBLEMS.find(p => p.id === answers.problem) || PROBLEMS[0];

  useEffect(() => {
    if (!breathing) return;
    const seq = [
      { label: "inspira", dur: 4000 },
      { label: "trattieni", dur: 7000 },
      { label: "espira", dur: 8000 },
    ];
    let idx = 0;
    let c = 0;
    const runPhase = () => {
      if (c >= 3) { setBreathing(false); setStep(2); return; }
      setPhase(seq[idx].label);
      setCount(Math.ceil(seq[idx].dur / 1000));
      const countDown = setInterval(() => setCount(v => Math.max(0, v - 1)), 1000);
      setTimeout(() => {
        clearInterval(countDown);
        idx++;
        if (idx >= seq.length) { idx = 0; c++; setCycles(c); }
        runPhase();
      }, seq[idx].dur);
    };
    runPhase();
  }, [breathing]);

  if (step === 0) return (
    <div className="scroll-section fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
      <div className="section-container" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{problem.icon}</div>
        <h2 className="serif" style={{ fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, fontWeight: 400 }}>
          Prova la Tecnica <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Respiro Quantico 4-7-8</span>
        </h2>
        <p style={{ color: "var(--text2)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7, fontSize: 15 }}>
          Questa è solo UNA delle {TECHNIQUES[answers.problem]?.length || 3} tecniche del tuo percorso personalizzato. Provalo ora — 1 minuto.
        </p>
        <button className="btn-gold" onClick={() => { setStep(1); setBreathing(true); }}>
          Inizia l'Esperienza →
        </button>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="scroll-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{
        width: "clamp(180px, 40vw, 260px)", height: "clamp(180px, 40vw, 260px)",
        borderRadius: "50%", margin: "0 auto 40px",
        background: `radial-gradient(circle, ${problem.color}22, transparent)`,
        border: `2px solid ${problem.color}44`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: phase === "inspira" ? "pulse 4s ease infinite" : phase === "espira" ? "pulse 8s ease infinite" : "none",
        transition: "all 1s ease",
        transform: phase === "inspira" ? "scale(1.15)" : phase === "espira" ? "scale(0.9)" : "scale(1.05)",
      }}>
        <div className="serif" style={{ fontSize: 48, color: "var(--gold)", fontWeight: 700 }}>{count}</div>
        <div style={{ fontSize: 18, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 3, marginTop: 4 }}>{phase}</div>
      </div>
      <p style={{ fontSize: 13, color: "var(--text2)" }}>Ciclo {cycles + 1} di 3</p>
    </div>
  );

  return (
    <div className="scroll-section fade-up" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
      <div className="section-container" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
        <h2 className="serif" style={{ fontSize: "clamp(26px, 5vw, 36px)", marginBottom: 12 }}>
          Senti la differenza?
        </h2>
        <p style={{ color: "var(--text2)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Questa era solo <strong style={{ color: "var(--gold)" }}>1 tecnica su {(TECHNIQUES[answers.problem]?.length || 3) * 4}+</strong> nel tuo percorso completo.
          Immagina cosa succede dopo 7 giorni di pratica guidata personalizzata.
        </p>
        <div className="card" style={{ maxWidth: 400, margin: "0 auto 32px", padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>Il tuo percorso completo include:</div>
          {["Tecniche giornaliere personalizzate", "Tracker progressi in tempo reale", "Community e classifiche live", "Guadagni dal passaparola reale"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 14 }}>
              <span style={{ color: "var(--teal)" }}>✓</span> {t}
            </div>
          ))}
        </div>
        <button className="btn-gold" onClick={onContinue} style={{ fontSize: 17, padding: "18px 48px" }}>
          Vedi il Piano Completo →
        </button>
      </div>
    </div>
  );
}

// ─── Offer Phase ───
function OfferPhase({ answers, onJoin }) {
  const [countdown, setCountdown] = useState({ h: 0, m: 14, s: 59 });
  const [spots, setSpots] = useState(7);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => {
      let { h, m, s } = c;
      s--; if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) return { h: 0, m: 0, s: 0 };
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);

  const handleCheckout = async () => {
    if (!email || !email.includes("@")) { setError("Inserisci un'email valida"); return; }
    setLoading(true);
    setError("");

    // Get referral code from localStorage (saved when user first arrived with ?ref=)
    const referralCode = localStorage.getItem("si_ref") || "";

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referralCode, quizAnswers: answers }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setError(data.error || "Errore nella creazione del pagamento");
        setLoading(false);
      }
    } catch (err) {
      setError("Errore di connessione. Riprova.");
      setLoading(false);
    }
  };

  const problem = PROBLEMS.find(p => p.id === answers.problem) || PROBLEMS[0];
  const relevant = TESTIMONIALS.filter(t => t.problem === answers.problem);

  return (
    <div className="scroll-section fade-in" style={{ padding: "40px 20px 60px" }}>
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="live-badge" style={{ margin: "0 auto 20px" }}>
            <div className="live-dot" /><span>Solo {spots} posti rimasti oggi</span>
          </div>
          <h2 className="serif" style={{ fontSize: "clamp(28px, 5.5vw, 44px)", lineHeight: 1.15, marginBottom: 16, fontWeight: 400 }}>
            Il Tuo Percorso<br /><span style={{ color: "var(--gold)", fontWeight: 700, fontStyle: "italic" }}>{problem.label}</span> ti Aspetta
          </h2>
          <p style={{ color: "var(--text2)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Accesso completo a tutte le tecniche, community, classifiche, e sistema di guadagno dal passaparola.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="share-card" style={{ marginBottom: 32, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--text2)", textDecoration: "line-through", marginBottom: 4 }}>€97/mese</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 4 }}>
              <span className="serif" style={{ fontSize: 56, fontWeight: 700, color: "var(--gold)" }}>€27</span>
              <span style={{ color: "var(--text2)", fontSize: 16 }}>/mese</span>
            </div>
            <p style={{ color: "var(--teal)", fontSize: 14, marginBottom: 20 }}>Offerta lancio — risparmi €840/anno</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              <div className="countdown-digit">{String(countdown.h).padStart(2, "0")}</div>
              <span style={{ color: "var(--gold)", fontSize: 24, lineHeight: "48px" }}>:</span>
              <div className="countdown-digit">{String(countdown.m).padStart(2, "0")}</div>
              <span style={{ color: "var(--gold)", fontSize: 24, lineHeight: "48px" }}>:</span>
              <div className="countdown-digit">{String(countdown.s).padStart(2, "0")}</div>
            </div>
            <button className="btn-gold" onClick={handleCheckout} disabled={loading} style={{ width: "100%", fontSize: 17, padding: "18px 0", animation: loading ? "none" : "glow 2s infinite", opacity: loading ? 0.7 : 1 }}>
              {loading ? "⏳ Reindirizzamento a Stripe..." : "Inizia Ora — 7 Giorni Gratis →"}
            </button>
            <div style={{ marginTop: 16 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="La tua email..."
                style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "var(--bg3)", color: "var(--text)", fontSize: 15, fontFamily: "'DM Sans'", outline: "none", marginBottom: 8 }}
                onFocus={e => e.target.style.borderColor = "rgba(212,168,83,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 4 }}>{error}</p>}
            </div>
            <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 8 }}>✓ Cancella quando vuoi &nbsp; ✓ Garanzia 30 giorni &nbsp; ✓ Guadagna dal referral</p>
            <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, opacity: 0.6 }}>🔒 Pagamento sicuro via Stripe · Nessun dato salvato da noi</p>
          </div>
        </div>

        {/* What's included */}
        <div style={{ marginBottom: 40 }}>
          <h3 className="serif" style={{ fontSize: 22, textAlign: "center", marginBottom: 20, fontWeight: 400 }}>Tutto quello che ottieni:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              ["🎯","Percorso 100% Personalizzato","Tecniche scelte per il TUO profilo"],
              ["🏆","Classifiche Live","Competi e guadagna punti XP"],
              ["💰","Sistema Referral","Guadagna €10 per ogni invitato"],
              ["🔥","Sfide Settimanali","Streak, badge e ricompense reali"],
              ["🧠","12+ Protocolli Esclusivi","Tecniche testate scientificamente"],
              ["🤝","Community Privata","Migliaia di praticanti attivi"],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {relevant.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 className="serif" style={{ fontSize: 22, textAlign: "center", marginBottom: 20, fontWeight: 400 }}>Storie come la tua</h3>
            {relevant.map((t, i) => (
              <div key={i} className="card" style={{ marginBottom: 12, display: "flex", gap: 16, alignItems: "start" }}>
                <div style={{ fontSize: 36 }}>{t.photo}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.name} <span style={{ fontWeight: 400, color: "var(--text2)", fontSize: 13 }}>· {t.city}</span></div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text2)", marginBottom: 6 }}>"{t.text}"</p>
                  <span className="xp-badge" style={{ background: "rgba(92,231,181,0.1)", borderColor: "rgba(92,231,181,0.3)", color: "var(--teal)" }}>{t.result}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Phase ───
function DashboardPhase({ answers, user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [xp, setXp] = useState(240);
  const [streak, setStreak] = useState(3);
  const [level, setLevel] = useState(2);
  const [copied, setCopied] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activePractice, setActivePractice] = useState(null); // index of technique
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [practiceRunning, setPracticeRunning] = useState(false);
  const [completedTechniques, setCompletedTechniques] = useState([]);
  const [breathPhase, setBreathPhase] = useState("");
  const [avatar, setAvatar] = useState("👤");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);
  const problem = PROBLEMS.find(p => p.id === answers.problem) || PROBLEMS[0];
  const techniques = TECHNIQUES[answers.problem] || TECHNIQUES.meditation;

  const appUrl = window.location.origin;
  const REFERRAL_LINK = user?.referralCode ? `${appUrl}?ref=${user.referralCode}` : `${appUrl}?ref=demo`;
  const REFERRAL_DISPLAY = user?.referralCode ? `${window.location.host}?ref=${user.referralCode.slice(0,12)}...` : "Link non disponibile";

  const AVATAR_EMOJIS = ["👤","🧘","🧙","🦊","🐉","🌸","🔮","🌙","💎","🦅","🐺","🌊","☀️","🪷","🧿","🦋"];
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setAvatar(ev.target.result); setShowAvatarPicker(false); };
    reader.readAsDataURL(file);
  };

  const tierName = xp < 500 ? "Cercatore" : xp < 1500 ? "Iniziato" : xp < 5000 ? "Illuminato" : "Maestro";
  const tierColor = xp < 500 ? "var(--text2)" : xp < 1500 ? "var(--teal)" : xp < 5000 ? "var(--gold)" : "var(--purple)";
  const nextXp = xp < 500 ? 500 : xp < 1500 ? 1500 : xp < 5000 ? 5000 : 10000;

  const leaderboard = [
    { name: "Tu", xp: xp, level, streak, isYou: true },
    { name: "Marco R.", xp: 3420, level: 8, streak: 21 },
    { name: "Giulia S.", xp: 2890, level: 7, streak: 14 },
    { name: "Alessandro V.", xp: 2310, level: 6, streak: 9 },
    { name: "Sara T.", xp: 1870, level: 5, streak: 7 },
    { name: "Luca B.", xp: 1540, level: 4, streak: 12 },
  ].sort((a, b) => b.xp - a.xp);

  const practiceGuides = PRACTICE_GUIDES[answers.problem] || PRACTICE_GUIDES.meditation;

  const startPractice = (techIndex) => {
    setActivePractice(techIndex);
    setPracticeStep(0);
    setPracticeTimer(0);
    setPracticeRunning(false);
    setBreathPhase("");
  };

  const completePractice = () => {
    const xpGain = [50, 75, 100][activePractice] || 50;
    setXp(x => x + xpGain);
    if (!completedTechniques.includes(activePractice)) {
      setCompletedTechniques(prev => [...prev, activePractice]);
    }
    if (activePractice === 0 && !completedToday) {
      setCompletedToday(true);
      setStreak(s => s + 1);
    }
    setActivePractice(null);
    setShowShare(true);
    setTimeout(() => setShowShare(false), 6000);
  };

  // Timer effect for active practice
  useEffect(() => {
    if (activePractice === null || !practiceRunning) return;
    const guide = practiceGuides[activePractice];
    if (!guide || !guide[practiceStep]) return;
    const step = guide[practiceStep];

    if (step.type === "breathe" && step.pattern) {
      const [inhale, hold, exhale] = step.pattern;
      const totalCycle = inhale + hold + exhale;
      const cycles = Math.floor(step.duration / totalCycle);
      let elapsed = 0;
      let currentCycle = 0;
      const phases = [
        { label: "Inspira", dur: inhale },
        { label: "Trattieni", dur: hold },
        { label: "Espira", dur: exhale },
      ];
      let phaseIdx = 0;
      let phaseTime = 0;

      setBreathPhase(phases[0].label);
      setPracticeTimer(phases[0].dur);

      const interval = setInterval(() => {
        phaseTime++;
        const remaining = phases[phaseIdx].dur - phaseTime;
        setPracticeTimer(Math.max(0, remaining));

        if (phaseTime >= phases[phaseIdx].dur) {
          phaseTime = 0;
          phaseIdx++;
          if (phaseIdx >= phases.length) {
            phaseIdx = 0;
            currentCycle++;
            if (currentCycle >= cycles) {
              clearInterval(interval);
              setPracticeRunning(false);
              setBreathPhase("");
              if (practiceStep < guide.length - 1) {
                setPracticeStep(s => s + 1);
              }
              return;
            }
          }
          setBreathPhase(phases[phaseIdx].label);
          setPracticeTimer(phases[phaseIdx].dur);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setPracticeTimer(step.duration);
      setBreathPhase("");
      const interval = setInterval(() => {
        setPracticeTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            setPracticeRunning(false);
            if (practiceStep < guide.length - 1) {
              setPracticeStep(s => s + 1);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activePractice, practiceStep, practiceRunning]);

  const shareTo = (platform) => {
    const text = `🔥 Ho appena completato il Giorno ${streak + 1} del mio percorso ${problem.label} su Saggezza Illuminata! ${xp + 50} XP guadagnati.\n\n✨ Prova gratis anche tu — 7 giorni di tecniche personalizzate:\n${REFERRAL_LINK}`;
    const encodedText = encodeURIComponent(text);
    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      instagram: null,
    };
    if (platform === "instagram") {
      try { navigator.clipboard.writeText(text); } catch(e) {}
      alert("Testo copiato! Apri Instagram e incollalo nella tua storia o post. 📸");
      return;
    }
    const url = urls[platform];
    if (url) window.open(url, "_blank", "noopener");
    setShowShare(false);
  };

  const tabs = [
    { id: "home", icon: "◇", label: "Home" },
    { id: "rank", icon: "🏆", label: "Classifica" },
    { id: "refer", icon: "💰", label: "Referral" },
    { id: "profile", icon: "👤", label: "Profilo" },
  ];

  return (
    <div className="scroll-section fade-in" style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* Top Bar */}
      <div className="gamification-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="serif" style={{ fontSize: 18, color: "var(--gold)" }}>◇</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Livello {level}</div>
            <div className="progress-ring" style={{ width: 80, height: 4 }}>
              <div className="progress-fill" style={{ width: `${(xp / nextXp) * 100}%` }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="xp-badge">{xp} XP</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
            <span className="streak-fire">🔥</span> {streak}
          </span>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: avatar.startsWith("data:") ? "none" : "linear-gradient(135deg, var(--gold), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, overflow: "hidden", border: "1.5px solid rgba(212,168,83,0.3)" }}>
            {avatar.startsWith("data:") ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatar}
          </div>
        </div>
      </div>

      {/* Practice Overlay */}
      {activePractice !== null && practiceGuides[activePractice] && (() => {
        const guide = practiceGuides[activePractice];
        const step = guide[practiceStep];
        const tech = techniques[activePractice];
        const isLastStep = practiceStep >= guide.length - 1;
        const pct = ((practiceStep + (practiceRunning ? 0.5 : 0)) / guide.length) * 100;
        const xpGain = [50, 75, 100][activePractice] || 50;
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "auto" }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <button onClick={() => setActivePractice(null)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans'" }}>✕ Esci</button>
              <span style={{ fontSize: 12, color: "var(--gold)" }}>+{xpGain} XP</span>
            </div>
            {/* Progress */}
            <div style={{ padding: "0 20px" }}>
              <div className="progress-ring" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text2)" }}>Step {practiceStep + 1}/{guide.length}</span>
                <span style={{ fontSize: 11, color: "var(--text2)" }}>{tech.name}</span>
              </div>
            </div>
            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", textAlign: "center" }}>
              {/* Timer Circle */}
              <div style={{
                width: 160, height: 160, borderRadius: "50%", margin: "0 auto 32px",
                background: step.type === "breathe"
                  ? `radial-gradient(circle, ${breathPhase === "Inspira" ? "rgba(92,231,181,0.15)" : breathPhase === "Espira" ? "rgba(231,92,141,0.15)" : "rgba(212,168,83,0.15)"}, transparent)`
                  : "radial-gradient(circle, rgba(107,92,231,0.12), transparent)",
                border: `2px solid ${step.type === "breathe" ? (breathPhase === "Inspira" ? "rgba(92,231,181,0.3)" : breathPhase === "Espira" ? "rgba(231,92,141,0.3)" : "rgba(212,168,83,0.3)") : "rgba(107,92,231,0.2)"}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transition: "all 0.8s ease",
                transform: step.type === "breathe" ? (breathPhase === "Inspira" ? "scale(1.12)" : breathPhase === "Espira" ? "scale(0.88)" : "scale(1)") : "scale(1)",
              }}>
                <div className="serif" style={{ fontSize: 44, color: "var(--gold)", fontWeight: 700 }}>
                  {practiceRunning ? practiceTimer : "●"}
                </div>
                {breathPhase && practiceRunning && (
                  <div style={{ fontSize: 13, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{breathPhase}</div>
                )}
              </div>
              <h3 className="serif" style={{ fontSize: 26, marginBottom: 12, color: "var(--gold2)", fontWeight: 400 }}>{step.title}</h3>
              <p style={{ fontSize: 16, color: "var(--text)", maxWidth: 440, lineHeight: 1.8, marginBottom: 32 }}>{step.instruction}</p>
              {!practiceRunning && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  {practiceTimer === 0 && !isLastStep && (
                    <button className="btn-gold" onClick={() => setPracticeRunning(true)} style={{ padding: "16px 40px" }}>
                      ▶ Inizia — {step.duration}s
                    </button>
                  )}
                  {practiceTimer === 0 && isLastStep && (
                    <button className="btn-gold" onClick={completePractice} style={{ padding: "16px 40px", animation: "glow 2s infinite" }}>
                      ✨ Completa Pratica (+{xpGain} XP)
                    </button>
                  )}
                  {practiceTimer > 0 && (
                    <button className="btn-gold" onClick={() => setPracticeRunning(true)} style={{ padding: "16px 40px" }}>
                      ▶ Continua
                    </button>
                  )}
                  {practiceStep > 0 && practiceTimer === 0 && !isLastStep && (
                    <button className="btn-outline" onClick={() => setPracticeRunning(true)}>
                      Avanti →
                    </button>
                  )}
                </div>
              )}
              {practiceRunning && (
                <p style={{ fontSize: 12, color: "var(--text2)", opacity: 0.5 }}>Segui le istruzioni...</p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Share Popup */}
      {showShare && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 200,
          background: "var(--bg2)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: 20, padding: 32,
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", maxWidth: 360, width: "90%"
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 className="serif" style={{ fontSize: 24, marginBottom: 8, color: "var(--gold)" }}>+50 XP Guadagnati!</h3>
          <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>Condividi il tuo traguardo e guadagna €10 per ogni amico che si iscrive!</p>
          <button className="btn-gold" onClick={() => shareTo('whatsapp')} style={{ width: "100%", marginBottom: 8 }}>
            📲 Condividi su WhatsApp
          </button>
          <button className="btn-outline" onClick={() => shareTo('instagram')} style={{ width: "100%" }}>
            Condividi su Instagram
          </button>
        </div>
      )}

      <div style={{ padding: "20px 16px" }}>
        {/* HOME TAB */}
        {tab === "home" && (
          <div className="section-container fade-up">
            <div style={{ marginBottom: 28 }}>
              <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Buongiorno ✨</h2>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Il tuo percorso {problem.label} — Giorno {streak + 1}</p>
            </div>

            {/* Today's Practice */}
            <div className="card" style={{ marginBottom: 16, background: completedTechniques.includes(0) ? "rgba(92,231,181,0.05)" : "rgba(212,168,83,0.05)", border: completedTechniques.includes(0) ? "1px solid rgba(92,231,181,0.2)" : "1px solid rgba(212,168,83,0.2)" }}>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Pratica di Oggi</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: "var(--gold2)" }}>{techniques[0].name}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>{techniques[0].time} · {techniques[0].result}</p>
              <button className={completedTechniques.includes(0) ? "btn-outline" : "btn-gold"} onClick={() => completedTechniques.includes(0) ? null : startPractice(0)}
                style={completedTechniques.includes(0) ? { width: "100%", borderColor: "rgba(92,231,181,0.4)", color: "var(--teal)" } : { width: "100%" }}>
                {completedTechniques.includes(0) ? "✓ Completata — +50 XP" : "▶ Inizia Pratica Guidata (+50 XP)"}
              </button>
            </div>

            {/* Other Techniques */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>Altre Tecniche</div>
              {techniques.slice(1).map((t, i) => {
                const idx = i + 1;
                const done = completedTechniques.includes(idx);
                const xpGain = [50, 75, 100][idx] || 50;
                return (
                  <div key={i} className="technique-card" style={{ marginBottom: 8, padding: 14, cursor: "pointer", opacity: done ? 0.6 : 1 }} onClick={() => !done && startPractice(idx)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</span>
                      {done
                        ? <span style={{ fontSize: 12, color: "var(--teal)" }}>✓ Completata</span>
                        : <span className="xp-badge" style={{ fontSize: 11 }}>+{xpGain} XP</span>
                      }
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{t.time} · {t.result}</div>
                  </div>
                );
              })}
            </div>

            {/* Weekly Challenge */}
            <div className="card" style={{ background: "linear-gradient(135deg, rgba(107,92,231,0.1), rgba(107,92,231,0.02))", border: "1px solid rgba(107,92,231,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--purple)" }}>Sfida Settimanale</span>
              </div>
              <p style={{ fontSize: 14, marginBottom: 8 }}>Completa 5 pratiche consecutive</p>
              <div className="progress-ring"><div className="progress-fill" style={{ width: `${(Math.min(streak, 5) / 5) * 100}%`, background: "linear-gradient(90deg, var(--purple), #9B8FFF)" }} /></div>
              <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 6 }}>{Math.min(streak, 5)}/5 — Premio: 200 XP + Badge "Costante" 🏅</p>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "rank" && (
          <div className="section-container fade-up">
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Classifica Live</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>Aggiornata in tempo reale</p>
            <div className="live-badge" style={{ marginBottom: 20 }}><div className="live-dot" /><span>1.247 praticanti attivi questa settimana</span></div>
            {leaderboard.map((u, i) => (
              <div key={i} className="leaderboard-row" style={u.isYou ? { background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 10 } : {}}>
                <span style={{ width: 28, textAlign: "center", fontSize: 18, fontWeight: 700, color: i === 0 ? "var(--gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--text2)" }}>
                  {i < 3 ? ["🥇","🥈","🥉"][i] : i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: u.isYou ? 700 : 400, color: u.isYou ? "var(--gold)" : "var(--text)" }}>{u.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: 8 }}>Lv.{u.level}</span>
                </div>
                <span style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}><span className="streak-fire">🔥</span>{u.streak}</span>
                <span className="xp-badge">{u.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        )}

        {/* REFERRAL TAB */}
        {tab === "refer" && (
          <div className="section-container fade-up">
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Guadagna Condividendo</h2>
            <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
              Ogni persona che si iscrive con il tuo link ti fa guadagnare <strong style={{ color: "var(--gold)" }}>€10 reali</strong> + 100 XP.
            </p>
            <div className="share-card" style={{ marginBottom: 24 }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
                <h3 className="serif" style={{ fontSize: 28, color: "var(--gold)", marginBottom: 4 }}>€0.00</h3>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Guadagni totali dal referral</p>
                <div className="referral-link-box" style={{ marginBottom: 16 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{REFERRAL_DISPLAY}</span>
                  <button onClick={() => { navigator.clipboard?.writeText(REFERRAL_LINK).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
                    style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", fontFamily: "'DM Sans'" }}>
                    {copied ? "✓ Copiato!" : "Copia"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button className="btn-gold" onClick={() => shareTo('whatsapp')} style={{ padding: "14px 0", fontSize: 14 }}>📲 WhatsApp</button>
                  <button className="btn-outline" onClick={() => shareTo('instagram')} style={{ padding: "14px 0", fontSize: 14 }}>📸 Instagram</button>
                  <button className="btn-outline" onClick={() => shareTo('twitter')} style={{ padding: "14px 0", fontSize: 14 }}>🐦 Twitter</button>
                  <button className="btn-outline" onClick={() => shareTo('facebook')} style={{ padding: "14px 0", fontSize: 14 }}>📘 Facebook</button>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Come Funziona</h3>
            {[
              ["1️⃣", "Condividi il tuo link o i tuoi risultati"],
              ["2️⃣", "Il tuo amico prova gratis per 7 giorni"],
              ["3️⃣", "Quando diventa membro, ricevi €10 reali"],
              ["4️⃣", "Senza limiti — più inviti, più guadagni"],
            ].map(([n, t], i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize: 18 }}>{n}</span>
                <span style={{ fontSize: 14, color: "var(--text2)" }}>{t}</span>
              </div>
            ))}

            <div className="card" style={{ marginTop: 20, background: "rgba(92,231,181,0.05)", border: "1px solid rgba(92,231,181,0.2)" }}>
              <div style={{ fontSize: 13, color: "var(--teal)", fontWeight: 600, marginBottom: 4 }}>💡 Consiglio Pro</div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                Condividi il momento in cui completi una pratica — le storie di trasformazione reale convertono 3x di più di un semplice link.
              </p>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div className="section-container fade-up">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div onClick={() => setShowAvatarPicker(!showAvatarPicker)} style={{ width: 80, height: 80, borderRadius: "50%", background: avatar.startsWith("data:") ? "none" : "linear-gradient(135deg, var(--gold), var(--purple))", margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, cursor: "pointer", position: "relative", overflow: "hidden", border: "2px solid rgba(212,168,83,0.4)" }}>
                {avatar.startsWith("data:") ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatar}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", fontSize: 10, padding: "3px 0", color: "#fff" }}>Cambia</div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
              {showAvatarPicker && (
                <div className="card fade-in" style={{ maxWidth: 300, margin: "12px auto", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>Scegli un avatar</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                    {AVATAR_EMOJIS.map(e => (
                      <div key={e} onClick={() => { setAvatar(e); setShowAvatarPicker(false); }}
                        style={{ width: 40, height: 40, borderRadius: 10, background: avatar === e ? "rgba(212,168,83,0.2)" : "var(--bg3)", border: avatar === e ? "1.5px solid var(--gold)" : "1.5px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", transition: "all 0.2s" }}>
                        {e}
                      </div>
                    ))}
                  </div>
                  <button className="btn-outline" onClick={() => fileInputRef.current?.click()} style={{ width: "100%", fontSize: 13 }}>
                    📷 Carica una foto
                  </button>
                </div>
              )}
              <h2 className="serif" style={{ fontSize: 24 }}>Il Tuo Profilo</h2>
              <div className="tier-badge" style={{ background: `${tierColor}18`, border: `1px solid ${tierColor}44`, color: tierColor, marginTop: 8 }}>
                ◇ {tierName}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                ["Livello", level],
                ["XP Totali", xp],
                ["Streak", `${streak} 🔥`],
                ["Badge", "2 🏅"],
                ["Referral", "0 👥"],
                ["Guadagni", "€0"],
              ].map(([l, v], i) => (
                <div key={i} className="card" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>Percorso Attivo</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>{problem.icon}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{problem.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{problem.desc}</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>Prossimo Livello</div>
              <div className="progress-ring" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${(xp / nextXp) * 100}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{xp} / {nextXp} XP</div>
            </div>

            {/* Account & Subscription */}
            {user && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>Account</div>
                <div className="card" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Email</div>
                  <div style={{ fontSize: 14 }}>{user.email}</div>
                </div>
                {user.trialEnd && new Date(user.trialEnd) > new Date() && (
                  <div className="card" style={{ marginBottom: 8, background: "rgba(92,231,181,0.05)", border: "1px solid rgba(92,231,181,0.2)" }}>
                    <div style={{ fontSize: 12, color: "var(--teal)" }}>✨ Trial gratuito attivo fino al {new Date(user.trialEnd).toLocaleDateString("it-IT")}</div>
                  </div>
                )}
                <button onClick={async () => {
                  try {
                    const res = await fetch("/api/customer-portal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ customerId: user.customerId }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch (e) { console.error(e); }
                }} className="btn-outline" style={{ width: "100%", marginBottom: 8 }}>
                  ⚙ Gestisci Abbonamento
                </button>
                <button onClick={onLogout} className="btn-outline" style={{ width: "100%", borderColor: "rgba(231,92,141,0.3)", color: "var(--pink)" }}>
                  Esci
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "6px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: tab === t.id ? "var(--gold)" : "var(--text2)", transition: "all 0.2s",
            fontFamily: "'DM Sans'",
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 11 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ───
export default function SaggezzaIlluminata() {
  const [phase, setPhase] = useState(PHASES.LANDING);
  const [answers, setAnswers] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const ADMIN_PASSWORD = "saggezza2026";

  // Auth state
  const [user, setUser] = useState(null); // { customerId, email, referralCode, subscriptionId }
  const [verifying, setVerifying] = useState(true);

  // On load: check for returning from Stripe or existing session
  useEffect(() => {
    const checkAccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const status = urlParams.get("status");

      // Coming back from Stripe checkout
      if (sessionId && status === "success") {
        try {
          const res = await fetch("/api/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (data.access) {
            const userData = {
              customerId: data.customerId,
              email: data.email,
              referralCode: data.referralCode,
              subscriptionId: data.subscriptionId,
              trialEnd: data.trialEnd,
            };
            localStorage.setItem("si_user", JSON.stringify(userData));
            setUser(userData);
            // Restore quiz answers if saved
            const savedAnswers = localStorage.getItem("si_answers");
            if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
            setPhase(PHASES.DASHBOARD);
            // Clean URL
            window.history.replaceState({}, "", window.location.pathname);
          }
        } catch (err) {
          console.error("Verify error:", err);
        }
      }
      // Check for cancelled
      else if (status === "cancelled") {
        window.history.replaceState({}, "", window.location.pathname);
      }
      // Check existing session
      else {
        const saved = localStorage.getItem("si_user");
        if (saved) {
          try {
            const userData = JSON.parse(saved);
            setUser(userData);
            const savedAnswers = localStorage.getItem("si_answers");
            if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
            setPhase(PHASES.DASHBOARD);
          } catch (e) { localStorage.removeItem("si_user"); }
        }
      }

      // Check for referral code in URL
      const ref = urlParams.get("ref");
      if (ref) localStorage.setItem("si_ref", ref);

      setVerifying(false);
    };
    checkAccess();
  }, []);

  // Save answers when they change (so they persist through Stripe redirect)
  useEffect(() => {
    if (answers.problem) localStorage.setItem("si_answers", JSON.stringify(answers));
  }, [answers]);

  const handleLogout = () => {
    localStorage.removeItem("si_user");
    localStorage.removeItem("si_answers");
    setUser(null);
    setPhase(PHASES.LANDING);
  };

  const toggleAdmin = () => {
    if (!adminUnlocked) {
      const pwd = prompt("Password Admin:");
      if (pwd === ADMIN_PASSWORD) { setAdminUnlocked(true); setShowAdmin(true); }
    } else { setShowAdmin(!showAdmin); }
  };

  const adminGo = (p, problemId) => {
    const a = { problem: problemId || "meditation", duration: "months", experience: "some", time: "15min" };
    setAnswers(a);
    setPhase(p);
    setShowAdmin(false);
  };

  if (verifying) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#D4A853" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "float 2s ease infinite" }}>◇</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>Saggezza Illuminata</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="si-app">
        {phase === PHASES.LANDING && <LandingPhase onStart={() => setPhase(PHASES.QUIZ)} />}
        {phase === PHASES.QUIZ && <QuizPhase onComplete={(a) => { setAnswers(a); setPhase(PHASES.DIAGNOSIS); }} />}
        {phase === PHASES.DIAGNOSIS && <DiagnosisPhase answers={answers} onContinue={() => setPhase(PHASES.DEMO)} />}
        {phase === PHASES.DEMO && <DemoPhase answers={answers} onContinue={() => setPhase(PHASES.OFFER)} />}
        {phase === PHASES.OFFER && <OfferPhase answers={answers} onJoin={() => setPhase(PHASES.DASHBOARD)} />}
        {phase === PHASES.DASHBOARD && <DashboardPhase answers={answers} user={user} onLogout={handleLogout} />}

        {/* Admin Panel */}
        <button onClick={toggleAdmin} style={{
          position: "fixed", top: 12, right: 12, zIndex: 9999, width: 36, height: 36, borderRadius: "50%",
          background: "transparent", border: "none", color: "rgba(255,255,255,0.08)",
          cursor: "default", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
        }}>⚙</button>

        {showAdmin && (
          <div style={{
            position: "fixed", top: 56, right: 12, zIndex: 9999, background: "var(--bg2)",
            border: "1px solid rgba(212,168,83,0.3)", borderRadius: 14, padding: 20, width: 280,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>🛠 Admin Panel</div>
            {user && <div style={{ fontSize: 11, color: "var(--teal)", marginBottom: 12, padding: "6px 10px", background: "rgba(92,231,181,0.08)", borderRadius: 8 }}>✓ Utente pagante: {user.email}</div>}
            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Vai a fase:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["Landing","Quiz","Diagnosi","Demo","Offerta","Dashboard"].map((name, i) => (
                <button key={i} onClick={() => i <= 1 ? (setPhase(i), setShowAdmin(false)) : adminGo(i, answers.problem || "meditation")}
                  style={{
                    background: phase === i ? "rgba(212,168,83,0.2)" : "var(--bg3)", border: phase === i ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                    color: phase === i ? "var(--gold)" : "var(--text2)", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'",
                  }}>{name}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Testa percorso:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PROBLEMS.map(p => (
                <button key={p.id} onClick={() => adminGo(PHASES.DASHBOARD, p.id)}
                  style={{
                    background: answers.problem === p.id ? "rgba(212,168,83,0.1)" : "var(--bg3)", border: answers.problem === p.id ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.06)",
                    color: "var(--text)", borderRadius: 10, padding: "10px 14px", fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10, textAlign: "left", fontFamily: "'DM Sans'",
                  }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>3 pratiche guidate</div>
                  </div>
                </button>
              ))}
            </div>
            {user && (
              <button onClick={handleLogout} style={{ marginTop: 12, width: "100%", padding: "8px", background: "rgba(231,92,141,0.1)", border: "1px solid rgba(231,92,141,0.3)", borderRadius: 8, color: "var(--pink)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                Logout (rimuovi accesso)
              </button>
            )}
            <div style={{ marginTop: 12, fontSize: 10, color: "var(--text2)", textAlign: "center", opacity: 0.6 }}>Fase attuale: {["Landing","Quiz","Diagnosi","Demo","Offerta","Dashboard"][phase]}</div>
          </div>
        )}
      </div>
    </>
  );
}
