/* classe jugador */
class Jugador{
  constructor(nom){
    this.nom=nom;
    this.t1={dins:0,intents:0};
    this.t2={dins:0,intents:0};
    this.t3={dins:0,intents:0};
    this.faltes={fetes:0,rebudes:0};
    this.rebots={ofensius:0,defensius:0};
    this.recuperades=0;
    this.perdudes=0;
    this.assistencies=0;
  }
  get punts(){return this.t1.dins+2*this.t2.dins+3*this.t3.dins;}
  get valoracio(){
    return (
      +1*this.t1.dins-(this.t1.intents-this.t1.dins)
      +2*this.t2.dins-(this.t2.intents-this.t2.dins)
      +3*this.t3.dins-(this.t3.intents-this.t3.dins)
      -this.faltes.fetes
      +this.faltes.rebudes
      +this.rebots.ofensius
      +this.rebots.defensius
      +this.recuperades
      -this.perdudes
      +this.assistencies
      );
  }

  //crear jugador des de json
  static from(json){
    let j=new Jugador();
    Object.assign(j,json);
    return j;
  }

  //sumar i corregir un intent
  intent(tir){
    if(!this[tir]) return;
    this[tir].intents++;
    log.nou_missatge(`falla ${tir}`,this,tir+'f');
  }
  corregir_intent(tir){
    if(!this[tir]) return;
    if(this[tir].intents <= 0) return;
    if(this[tir].dins >= this[tir].intents) return;
    this[tir].intents--;
    log.esborra_missatge(this,tir+'f');
  }

  //sumar i corregir un tir anotat
  dins(tir){
    if(!this[tir]) return;
    this[tir].dins++;
    this[tir].intents++;
    log.nou_missatge(`anota ${tir}`,this,tir);

    //registra parcial
    this.registra_parcial_tir(tir);
  }
  corregir_dins(tir){
    if(!this[tir]) return;
    if(this[tir].dins <= 0) return;
    this[tir].dins--;
    this[tir].intents--;
    log.esborra_missatge(this,tir);

    //corregeix parcial
    this.registra_parcial_tir(tir,true);
  }

  //afegeix els punts al parcial
  registra_parcial_tir(tir, corregir){
    corregir = corregir||false;
    let equip   = equips.Locals.jugadors.indexOf(this)+1 ? "Locals" : "Visitants"; //string
    let periode = app.periode; //int
    let punts   = tirs.indexOf(tir)+1;
    if(corregir) punts *= -1;
    equips[equip].parcials.find(p=>p.periode==periode).punts += punts;
  }

  //afegeix la falta al parcial
  registra_parcial_falta(corregir){
    corregir = corregir||false;
    let equip = equips.Locals.jugadors.indexOf(this)+1 ? "Locals" : "Visitants"; //string
    let periode = app.periode; //int
    let faltes = corregir ? -1 : 1;
    equips[equip].parcials.find(p=>p.periode==periode).faltes += faltes;
  }

  //suma i corregir faltes
  afegir_falta(jugador_objectiu){ //falta feta
    jugador_objectiu = jugador_objectiu || false;
    if(this.faltes.fetes>=5){
      alert(`El jugador "${this.nom}" ja té ${this.faltes.fetes} faltes`);
      return;
    }
    this.faltes.fetes++;
    this.registra_parcial_falta();
    if(jugador_objectiu){
      jugador_objectiu.faltes.rebudes++;
      log.nou_missatge(`comet falta nº [${this.faltes.fetes}] a "${jugador_objectiu.nom}"`,this,'falta',jugador_objectiu);
    }else{
      log.nou_missatge(`comet falta nº [${this.faltes.fetes}] `,this,'falta');
    }
  }
  corregir_falta(jugador_objectiu){
    jugador_objectiu = jugador_objectiu || false;
    if(this.faltes.fetes>0){
      this.faltes.fetes--;
      this.registra_parcial_falta(true);
    }

    if(jugador_objectiu){
      jugador_objectiu.faltes.rebudes--;
    }else{
      //corregir falta sense jugador objectiu ??? TBD
      //cal restar-ne una de rebuda a algú (o no) pensar-ho
    }

    log.esborra_missatge(this,'falta',jugador_objectiu);
  }

  afegir_falta_rebuda(){ //falta rebuda
    this.faltes.rebudes++;
    log.nou_missatge(`rep falta`,this,'falta rebuda');
  }
  corregir_falta_rebuda(){
    this.faltes.rebudes--;
    log.esborra_missatge(this,'falta rebuda');
  }

  //afegir i corregir rebots ofensius i defensius
  afegir_rebot_ofe(){
    this.rebots.ofensius++;
    log.nou_missatge(`rebot ofensiu`,this,'rebot ofensiu');
  }
  afegir_rebot_def(){
    this.rebots.defensius++;
    log.nou_missatge(`rebot defensiu`,this,'rebot defensiu');
  }
  corregir_rebot_ofe(){
    if(this.rebots.ofensius>0) this.rebots.ofensius--;
    log.esborra_missatge(this,'rebot ofensiu');
  }
  corregir_rebot_def(){
    if(this.rebots.defensius>0) this.rebots.defensius--;
    log.esborra_missatge(this,'rebot defensiu');
  }

  //afegir i corregir pilota recuperada
  afegir_recuperada(){
    this.recuperades++;
    log.nou_missatge(`recupera pilota`,this,'recuperada');
  }
  corregir_recuperada(){
    if(this.recuperades>0) this.recuperades--;
    log.esborra_missatge(this,'recuperada');
  }

  //afegir i corregir pilota perduda
  afegir_perduda(){
    this.perdudes++;
    log.nou_missatge(`perd pilota`,this,'perduda');
  }
  corregir_perduda(){
    if(this.perdudes>0) this.perdudes--;
    log.esborra_missatge(this,'perduda');
  }

  //afegir i corregir assitencies
  afegir_assistencia(jugador_objectiu){
    jugador_objectiu = jugador_objectiu || false;
    this.assistencies++;
    if(jugador_objectiu){
      log.nou_missatge(`assisteix a "${jugador_objectiu.nom}"`,this,'assistencia');
    }else{
      log.nou_missatge(`assistència`,this,'assistencia');
    }
  }
  corregir_assistencia(){
    if(this.assistencies>0) this.assistencies--;
    log.esborra_missatge(this,'assistencia');
  }
}
