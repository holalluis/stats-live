/* KEYBOARD SHORTCUTS */
/*====================*/

document.addEventListener('keydown',function(ev){
  //console.log('tecla '+ev.key); //mostrar tecla
  let j=app.jugador_seleccionat;
  //console.log(ev.key);
  switch(ev.key){
    //moure cursor
    case "ArrowUp":   case "k": next_jugador_seleccionat(true); break;
    case "ArrowDown": case "j": next_jugador_seleccionat(); break;
    //cursor canvi equip
    case "m": canvi_equip_seleccionat(); break;
    //cursor dalt i baix
    case "g": inici_equip_seleccionat(); break;
    case "G": final_equip_seleccionat(); break;
    //buscar jugador
    case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9": case "0": inicia_cerca(ev.key); break;
    //repetir ultima cerca de jugador
    case "n": busca_jugador(ultima_cerca); break;
    //buscar jugador menu flotant
    case ";":     menu_flotant_selecciona_primer_jugador(); break;
    case "Enter": menu_flotant_selecciona_primer_jugador(true); break;
    //tirs de 1
    case "a": if(j) j.dins('t1');               break; //anota t1
    case "z": if(j) obrir_menu_rebots(j,'t1');  break; //falla t1
    case "A": if(j) j.corregir_dins('t1');      break; //corregir anota t1
    case "Z": if(j) j.corregir_intent('t1');    break; //corregir falla t1
    //tirs de 2
    case "s": if(j) j.dins('t2');               break; //anota t2
    case "x": if(j) obrir_menu_rebots(j,'t2');  break; //falla t2
    case "S": if(j) j.corregir_dins('t2');      break; //corregir anota t2
    case "X": if(j) j.corregir_intent('t2');    break; //corregir falla t2
    //tirs de 3
    case "d": if(j) j.dins('t3');               break; //anota t3
    case "c": if(j) obrir_menu_rebots(j,'t3');  break; //falla t3
    case "D": if(j) j.corregir_dins('t3');      break; //corregir anota t3
    case "C": if(j) j.corregir_intent('t3');    break; //corregir falla t3

    //assistencies
    case "e": if(j) obrir_menu_assistencies(j); break; //afegir assistencia
    case "E": if(j) j.corregir_assistencia();   break; //corregir assistencia

    //faltes
    case "f": if(j) obrir_menu_faltes(j);          break; //afegir falta feta (obrir menú)
    case "F": if(j) obrir_menu_corregir_faltes(j); break; //corregir falta feta
    case "r": if(j) j.afegir_falta_rebuda();       break; //afegir falta rebuda
    case "R": if(j) j.corregir_falta_rebuda();     break; //corregir falta rebuda

    //rebots defensius
    case "i": if(j) j.afegir_rebot_def();    break; //afegir rebot def
    case "I": if(j) j.corregir_rebot_def();  break; //corregir rebot def

    //rebots ofensius
    case "o": if(j) j.afegir_rebot_ofe();    break; //afegir rebot ofe
    case "O": if(j) j.corregir_rebot_ofe();  break; //corregir rebot ofe

    //recuperades
    case "ñ": if(j) j.afegir_recuperada();   break; //afegir recuperada
    case "Ñ": if(j) j.corregir_recuperada(); break; //corregir recuperada

    //perdudes
    case "p": if(j) j.afegir_perduda();      break; //afegir perduda
    case "P": if(j) j.corregir_perduda();    break; //corregir perduda

    //veure log
    case "l": log_vue.visible^=true;   break; //veure amagar log

    //q i escape: amaga menus flotants
    case "Escape":
    case "q":
      app.jugador_menu_faltes_visible          = null;
      app.jugador_menu_corregir_faltes_visible = null;
      app.jugador_menu_assistencies            = null;
      app.jugador_menu_rebots_visible={t1: null, t2: null, t3: null};
      break;
  }
});

/* FUNCIONS CURSOR JUGADOR SELECCIONAT */
/*=====================================*/

//obrir menu faltes
function obrir_menu_faltes(jugador){
  if(app.jugador_menu_faltes_visible==jugador){
    jugador.afegir_falta(); //sense jugador objectiu
    app.jugador_menu_faltes_visible=null; //tanca menú
    return;
  }
  app.jugador_menu_faltes_visible=jugador;
}

//obrir menu corregir faltes
function obrir_menu_corregir_faltes(jugador){
  if(app.jugador_menu_corregir_faltes_visible==jugador){
    jugador.corregir_falta();
    app.jugador_menu_corregir_faltes_visible=null; //tanca menú
    return;
  }
  app.jugador_menu_corregir_faltes_visible=jugador;
}

//obrir menu rebots
function obrir_menu_rebots(jugador,tir){
  if(app.jugador_menu_rebots_visible[tir]==jugador){
    jugador.intent(tir); //sense rebot
    app.jugador_menu_rebots_visible[tir]=null; //tanca menú
    return;
  }
  app.jugador_menu_rebots_visible[tir]=jugador;
}

//obrir menu assistencies
function obrir_menu_assistencies(jugador){
  if(app.jugador_menu_assistencies==jugador){
    jugador.afegir_assistencia(); //sense jugador objectiu
    app.jugador_menu_assistencies=null; //tanca menú
    return;
  }
  app.jugador_menu_assistencies=jugador;
}

//menu flotant selecciona primer jugador (focus)
function menu_flotant_selecciona_primer_jugador(enter_pressed){
  let sels = document.querySelectorAll('button.jugador_menu_flotant[seleccionat]');
  if(sels.length){
    for(let i=0;i<sels.length;i++){
      if(document.activeElement == sels[i]){
        let next_btn = sels[i+1];
        if(next_btn) next_btn.focus();
        else sels[0].focus();
        return true;
      }
    }
    sels[0].focus();
    return true;
  }
  let btns = document.querySelectorAll('button.jugador_menu_flotant');
  if(btns.length==0) return false;
  for(let i=0;i<btns.length;i++){
    if(document.activeElement == btns[i]){
      let next_btn = btns[i+1];
      if(next_btn){
        if(enter_pressed){ //si apreta enter evita que salti endavant i després es faci l'enter
          btns[i].focus();
        }else{
          next_btn.focus();
        }
      }else{
        btns[0].focus();
      }
      return true;
    }
  }
  btns[0].focus();
  return true;
}

//buscar amb timeout, estil finder OS X
let string_cerca=""; //string cerca pot augmentar durant mig segon
let ultima_cerca=""; //guarda la ultima cerca per repetir-la

function inicia_cerca(key){
  string_cerca += key;
  busca_jugador(string_cerca);
  ultima_cerca=string_cerca;
  setTimeout(function(){string_cerca="";},500);
}

//seleccionar jugador a partir de número de dorsal
function busca_jugador(key){
  if(key==0) key=10;
  let js = app.jugador_seleccionat || false; //jugador seleccionat actual
  let jugadors = app.equips.Locals.jugadors.concat(app.equips.Visitants.jugadors);
  let index = js ? jugadors.indexOf(js) : 0; //index inicial on buscar
  //cerca
  for(let i=index;i<jugadors.length;i++){
    let ji=jugadors[i];
    if(ji==js) continue;
    if(ji.nom.search(key)==0){
      app.jugador_seleccionat = ji;
      return;
    }
  }
  for(let i=0;i<index;i++){
    let ji=jugadors[i];
    if(ji==js) continue;
    if(ji.nom.search(key)==0){
      app.jugador_seleccionat = ji;
      return;
    }
  }
}

//selecciona següent jugador (next o prev)
function next_jugador_seleccionat(prev){
  prev=prev||false; //previous enlloc de next

  if(app.jugador_seleccionat==null){
    if(prev){
      //selecciona ultim visitant
      app.jugador_seleccionat=app.equips.Visitants.jugadors[app.equips.Visitants.jugadors.length-1];
    }else{
      //selecciona primer local
      app.jugador_seleccionat=app.equips.Locals.jugadors[0];
    }
    return;
  }

  let jugadors = app.equips.Locals.jugadors.concat(app.equips.Visitants.jugadors);
  let index = jugadors.indexOf(app.jugador_seleccionat);
  let next = prev ? -1 : 1;
  app.jugador_seleccionat=jugadors[index+next];
}

//selecciona el primer jugador del següent equip
function canvi_equip_seleccionat(){
  let j = app.jugador_seleccionat;
  if(app.equips.Locals.jugadors.indexOf(j)==-1){
    app.jugador_seleccionat = app.equips.Locals.jugadors[0];
  }else{
    app.jugador_seleccionat = app.equips.Visitants.jugadors[0];
  }
}

//selecciona el primer jugador de l'equip actual
function inici_equip_seleccionat(){
  app.jugador_seleccionat = app.equips.Locals.jugadors[0];
}

//selecciona ultim jugaodr de l'equip actual
function final_equip_seleccionat(){
  app.jugador_seleccionat = app.equips.Visitants.jugadors[app.equips.Visitants.jugadors.length-1];
}
