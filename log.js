/*******/
/* LOG */
/*******/

let log={
  missatges:[], //array objectes missatge

  //crear missatge (millor fer classe?)
  nou_missatge:function(text, jugador, tipus, jugador_objectiu){
    jugador_objectiu = jugador_objectiu || false; //en cas de falta: jugador que rep la falta
    let resultat = app.get_resultat();
    let periode = parseInt(document.querySelector('input[name="periode"]:checked').value);
    let msg={
      data:new Date(),
      periode,
      jugador,
      text,
      tipus,
      resultat,
      jugador_objectiu
    };
    this.missatges.unshift(msg); //afegir missatge al principi de l'array

    //tuiteja
    if(log_vue.twitter_activat){
      if(['perduda','recuperada'].indexOf(tipus)==-1){
        tweet(`
          Q${msg.periode} [${msg.jugador.nom}] ${msg.text} (${msg.resultat})
        `);
      }
    }

    /*parlar a cada acció TBD*/
    //speechSynthesis.speak(new SpeechSynthesisUtterance(jugador.nom+" "+text));
  },

  esborra_missatge:function(jugador, tipus, jugador_objectiu){
    jugador_objectiu = jugador_objectiu || false; //en cas de falta: jugador que rep la falta
    let m = null; //missatge a esborrar
    if(jugador_objectiu){
      m = this.missatges.find(m=>(m.tipus==tipus && m.jugador==jugador && m.jugador_objectiu==jugador_objectiu));
    }else{
      m = this.missatges.find(m=>(m.tipus==tipus && m.jugador==jugador));
    }
    if(!m) return false;
    let i = this.missatges.indexOf(m); //index del missatge trobat
    this.missatges.splice(i,1); //esborra missatge
    return true;
  }
}
