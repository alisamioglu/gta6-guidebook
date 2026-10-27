import { Language } from '@/i18n/strings';

type MissionText = { title: string; steps: string[] };

// english lives in data/missions.ts, these are keyed by mission id
export const missionTexts: Record<Exclude<Language, 'en'>, Record<string, MissionText>> = {
  tr: {
    'welcome-to-leonida': {
      title: "Leonida'ya Hoş Geldin",
      steps: ['İşareti takip edip motele git.', 'Resepsiyonla konuş ve oda anahtarını al.', 'Yukarı çık ve yatakta dinlen.'],
    },
    'easy-money': {
      title: 'Kolay Para',
      steps: ['Benzinliğe git ve arkaya park et.', 'Beyaz minibüsün gelmesini bekle.', 'Onu uzaktan takip et, çok yaklaşırsan hızlanıp kaçar.'],
    },
    'beach-run': {
      title: 'Sahil Koşusu',
      steps: ['Paketi iskeleden al.', 'Sahil yolundan plaja git.', 'Otoparkların içinden geçerek polisi atlat.'],
    },
    'night-shift': {
      title: 'Gece Vardiyası',
      steps: ['Oyunda saat 22:00 olana kadar bekle.', 'Depoya yan kapıdan gizlice gir.', 'İki bekçiyi sessizce etkisiz hâle getir.', 'Ofisten defteri al.'],
    },
    'swamp-trouble': {
      title: 'Bataklıkta Bela',
      steps: ['İskeleden bir hava botu al.', 'Timsahlardan uzak durmak için kanalın ortasında kal.', 'Seni kovalayan botlara pompalıyla ateş et.'],
    },
    'car-meet': {
      title: 'Araba Buluşması',
      steps: ['Buluşmaya herhangi bir spor araba getir.', 'İlk yarışı başlat.', 'Kazanmak için son iki virajda içten gir.'],
    },
    'pawn-shop': {
      title: 'Rehinci Dükkânı',
      steps: ['Rehinci dükkânının sahibiyle konuş.', 'Hırsızı yaya olarak kovala.', 'Ana yola çıkmadan yakalamak için soldaki ara sokaktan kes.'],
    },
    'high-rise': {
      title: 'Gökdelen',
      steps: ['Servis asansörüyle en üst kata çık.', 'Renkleri eşleştirerek paneli hackle.', 'Alarm bitmeden merdivenlerden in.'],
    },
    'bad-deal': {
      title: 'Kötü Anlaşma',
      steps: ['Marinadaki buluşmaya git.', 'Ateş başlayınca sağdaki kutuların arkasına siper al.', 'Önce teknedekileri indir.'],
    },
    'getaway-driver': {
      title: 'Kaçış Şoförü',
      steps: ['Bankanın önünde bekle.', 'Ekip arabaya binince hemen otoyola çık.', 'Yıldızları kaybetmek için alt geçitte araba değiştir.'],
    },
    'keys-escape': {
      title: 'Adalardan Kaçış',
      steps: ['Uzun köprüden güneye sür.', 'Ortadaki barikata dikkat et.', 'Geçmek için korkuluğun yanındaki şeridi kullan.'],
    },
    'old-friends': {
      title: 'Eski Dostlar',
      steps: ['Bağlantınla lokantada buluş.', 'Sohbete ayak uydur.', 'Arabaya zarar vermeden onu evine bırak.'],
    },
    'fire-sale': {
      title: 'Yangın Satışı',
      steps: ['Mağazadaki dört işaretli noktaya benzin dök.', 'Dışarı çık ve çakmağı at.', 'İtfaiye gelmeden uzaklaş.'],
    },
    'air-drop': {
      title: 'Havadan İkmal',
      steps: ['Uçağı pistten al.', 'Radara yakalanmamak için bataklığın üstünden alçak uç.', 'Yeşil duman tam altındayken kasayı bırak.'],
    },
    'club-night': {
      title: 'Kulüp Gecesi',
      steps: ['Önce kulüp kıyafetini giy.', 'VIP bilekliğini barmenden al.', 'Hedefi üst kattaki salonda bul.'],
    },
    'hot-wheels': {
      title: 'Sıcak Tekerlekler',
      steps: ['İşaretli üç arabayı çal.', 'Onları tek tek garaja getir.', 'Son arabada takip cihazı var, önce boyat.'],
    },
    'storm-warning': {
      title: 'Fırtına Uyarısı',
      steps: ['Fırtına başlamadan karavan parkına ulaş.', 'Sakinlerin sığınağa girmesine yardım et.', 'Ana karavandaki kasayı al.'],
    },
    'inside-man': {
      title: 'İçerideki Adam',
      steps: ['Çamaşırhaneden güvenlik üniformasını al.', 'Kameraların önünden yavaşça yürü.', 'Cihazı sunucu odasına yerleştir.'],
    },
    'double-cross': {
      title: 'İhanet',
      steps: ['Buluşmaya destekle git.', 'Anlaşma bozulunca arabayı limana kadar kovala.', 'Durdurmak için lastiklere ateş et.'],
    },
    'the-big-score': {
      title: 'Büyük Vurgun',
      steps: ['Ekibini ve gizli planı seç.', 'Binanın elektriğini kes.', 'Çatıdan gir ve kasayı al.', 'Kanaldan tekneyle kaç.'],
    },
  },
  es: {
    'welcome-to-leonida': {
      title: 'Bienvenido a Leonida',
      steps: ['Sigue el marcador hasta el motel.', 'Habla con el recepcionista y coge la llave.', 'Sube y descansa en la cama.'],
    },
    'easy-money': {
      title: 'Dinero fácil',
      steps: ['Ve a la gasolinera y aparca detrás.', 'Espera a que llegue la furgoneta blanca.', 'Síguela de lejos; si te acercas demasiado, acelera.'],
    },
    'beach-run': {
      title: 'Carrera a la playa',
      steps: ['Recoge el paquete en el muelle.', 'Toma la carretera de la costa hasta la playa.', 'Despista a la policía cruzando los aparcamientos.'],
    },
    'night-shift': {
      title: 'Turno de noche',
      steps: ['Espera a que sean las 22:00 en el juego.', 'Entra al almacén por la puerta lateral.', 'Neutraliza a los dos guardias sin hacer ruido.', 'Coge el libro de cuentas de la oficina.'],
    },
    'swamp-trouble': {
      title: 'Problemas en el pantano',
      steps: ['Coge un hidrodeslizador en el muelle.', 'Quédate en el centro del canal para evitar a los caimanes.', 'Usa la escopeta contra las lanchas que te persiguen.'],
    },
    'car-meet': {
      title: 'Quedada de coches',
      steps: ['Lleva cualquier deportivo a la quedada.', 'Empieza la primera carrera.', 'Toma el interior en las dos últimas curvas para ganar.'],
    },
    'pawn-shop': {
      title: 'La casa de empeños',
      steps: ['Habla con el dueño de la tienda.', 'Persigue al ladrón a pie.', 'Atajo por el callejón de la izquierda para pillarlo antes de la avenida.'],
    },
    'high-rise': {
      title: 'El rascacielos',
      steps: ['Sube al último piso en el ascensor de servicio.', 'Hackea el panel uniendo los colores.', 'Baja por las escaleras antes de que acabe la alarma.'],
    },
    'bad-deal': {
      title: 'Mal trato',
      steps: ['Ve a la reunión en el puerto deportivo.', 'Cuando empiecen los disparos, cúbrete tras las cajas de la derecha.', 'Acaba primero con los del barco.'],
    },
    'getaway-driver': {
      title: 'Conductor de huida',
      steps: ['Espera fuera del banco.', 'Cuando suba el equipo, entra a la autopista enseguida.', 'Cambia de coche en el paso subterráneo para perder las estrellas.'],
    },
    'keys-escape': {
      title: 'Huida por los cayos',
      steps: ['Conduce hacia el sur por el puente largo.', 'Cuidado con el control en el medio.', 'Usa el carril junto a la barandilla para pasar.'],
    },
    'old-friends': {
      title: 'Viejos amigos',
      steps: ['Reúnete con tu contacto en el diner.', 'Sigue la conversación.', 'Llévalo a casa sin dañar el coche.'],
    },
    'fire-sale': {
      title: 'Liquidación ardiente',
      steps: ['Echa gasolina en los cuatro puntos marcados de la tienda.', 'Sal y lanza el mechero.', 'Vete antes de que lleguen los bomberos.'],
    },
    'air-drop': {
      title: 'Lanzamiento aéreo',
      steps: ['Coge la avioneta en la pista.', 'Vuela bajo sobre el pantano para evitar el radar.', 'Suelta la caja cuando el humo verde esté justo debajo.'],
    },
    'club-night': {
      title: 'Noche de club',
      steps: ['Ponte primero la ropa de club.', 'Consigue la pulsera VIP del camarero.', 'Busca al objetivo en el salón de arriba.'],
    },
    'hot-wheels': {
      title: 'Ruedas calientes',
      steps: ['Roba los tres coches marcados.', 'Llévalos al taller uno por uno.', 'El último tiene un rastreador, píntalo primero.'],
    },
    'storm-warning': {
      title: 'Alerta de tormenta',
      steps: ['Llega al parque de caravanas antes de la tormenta.', 'Ayuda a los vecinos a entrar al refugio.', 'Coge la caja fuerte de la caravana principal.'],
    },
    'inside-man': {
      title: 'El infiltrado',
      steps: ['Coge el uniforme de guardia en la lavandería.', 'Camina despacio delante de las cámaras.', 'Coloca el dispositivo en la sala de servidores.'],
    },
    'double-cross': {
      title: 'Traición',
      steps: ['Ve a la reunión con refuerzos.', 'Cuando el trato se tuerza, persigue el coche hasta el puerto.', 'Dispara a las ruedas para detenerlo.'],
    },
    'the-big-score': {
      title: 'El gran golpe',
      steps: ['Elige a tu equipo y el plan sigiloso.', 'Corta la luz del edificio.', 'Entra por el tejado y vacía la cámara.', 'Huye en barco por el canal.'],
    },
  },
  de: {
    'welcome-to-leonida': {
      title: 'Willkommen in Leonida',
      steps: ['Folge der Markierung zum Motel.', 'Sprich mit dem Portier und hol den Zimmerschlüssel.', 'Geh nach oben und ruh dich im Bett aus.'],
    },
    'easy-money': {
      title: 'Leichtes Geld',
      steps: ['Fahr zur Tankstelle und park hinten.', 'Warte auf den weißen Lieferwagen.', 'Folge ihm mit Abstand, sonst gibt er Gas.'],
    },
    'beach-run': {
      title: 'Strandfahrt',
      steps: ['Hol das Paket am Pier ab.', 'Nimm die Küstenstraße zum Strand.', 'Häng die Polizei über die Parkplätze ab.'],
    },
    'night-shift': {
      title: 'Nachtschicht',
      steps: ['Warte bis 22:00 Uhr im Spiel.', 'Schleich dich durch die Seitentür ins Lagerhaus.', 'Schalte die zwei Wachen leise aus.', 'Nimm das Kassenbuch aus dem Büro.'],
    },
    'swamp-trouble': {
      title: 'Ärger im Sumpf',
      steps: ['Nimm ein Propellerboot am Steg.', 'Bleib in der Mitte des Kanals, weg von den Alligatoren.', 'Nimm die Verfolgerboote mit der Schrotflinte unter Beschuss.'],
    },
    'car-meet': {
      title: 'Autotreffen',
      steps: ['Bring einen beliebigen Sportwagen zum Treffen.', 'Starte das erste Rennen.', 'Nimm in den letzten zwei Kurven die Innenbahn, um zu gewinnen.'],
    },
    'pawn-shop': {
      title: 'Das Pfandhaus',
      steps: ['Sprich mit dem Besitzer des Pfandhauses.', 'Verfolge den Dieb zu Fuß.', 'Nimm die Gasse links, um ihn vor der Hauptstraße zu erwischen.'],
    },
    'high-rise': {
      title: 'Hochhaus',
      steps: ['Fahr mit dem Lastenaufzug ganz nach oben.', 'Hack das Panel, indem du die Farben zuordnest.', 'Nimm die Treppe nach unten, bevor der Alarm endet.'],
    },
    'bad-deal': {
      title: 'Faules Geschäft',
      steps: ['Geh zum Treffen am Yachthafen.', 'Wenn geschossen wird, geh rechts hinter den Kisten in Deckung.', 'Schalte zuerst die Leute auf dem Boot aus.'],
    },
    'getaway-driver': {
      title: 'Fluchtfahrer',
      steps: ['Warte vor der Bank.', 'Wenn die Crew einsteigt, fahr sofort auf den Highway.', 'Wechsle in der Unterführung das Auto, um die Sterne loszuwerden.'],
    },
    'keys-escape': {
      title: 'Flucht über die Keys',
      steps: ['Fahr über die lange Brücke nach Süden.', 'Pass auf die Straßensperre in der Mitte auf.', 'Nimm die Spur am Geländer, um vorbeizukommen.'],
    },
    'old-friends': {
      title: 'Alte Freunde',
      steps: ['Triff deinen Kontakt im Diner.', 'Spiel beim Gespräch mit.', 'Fahr ihn nach Hause, ohne das Auto zu beschädigen.'],
    },
    'fire-sale': {
      title: 'Brandheißer Ausverkauf',
      steps: ['Gieß Benzin an die vier markierten Stellen im Laden.', 'Geh raus und wirf das Feuerzeug.', 'Verschwinde, bevor die Feuerwehr kommt.'],
    },
    'air-drop': {
      title: 'Luftabwurf',
      steps: ['Hol das Flugzeug von der Landebahn.', 'Flieg tief über den Sumpf, um unter dem Radar zu bleiben.', 'Wirf die Kiste ab, wenn der grüne Rauch genau unter dir ist.'],
    },
    'club-night': {
      title: 'Clubnacht',
      steps: ['Zieh zuerst das Club-Outfit an.', 'Hol dir das VIP-Armband vom Barkeeper.', 'Finde das Ziel in der Lounge oben.'],
    },
    'hot-wheels': {
      title: 'Heiße Reifen',
      steps: ['Stiehl die drei markierten Autos.', 'Bring sie nacheinander in die Garage.', 'Das letzte hat einen Peilsender, lass es zuerst umlackieren.'],
    },
    'storm-warning': {
      title: 'Sturmwarnung',
      steps: ['Erreiche den Wohnwagenpark vor dem Sturm.', 'Hilf den Bewohnern in den Schutzraum.', 'Nimm den Safe aus dem Hauptwohnwagen.'],
    },
    'inside-man': {
      title: 'Der Insider',
      steps: ['Hol die Wachuniform aus der Wäscherei.', 'Geh langsam an den Kameras vorbei.', 'Platziere das Gerät im Serverraum.'],
    },
    'double-cross': {
      title: 'Doppeltes Spiel',
      steps: ['Geh mit Verstärkung zum Treffen.', 'Wenn der Deal platzt, verfolge das Auto bis zu den Docks.', 'Schieß auf die Reifen, um es zu stoppen.'],
    },
    'the-big-score': {
      title: 'Der große Coup',
      steps: ['Wähle deine Crew und den leisen Plan.', 'Kapp den Strom im Gebäude.', 'Steig übers Dach ein und räum den Tresor aus.', 'Flieh mit dem Boot über den Kanal.'],
    },
  },
  fr: {
    'welcome-to-leonida': {
      title: 'Bienvenue à Leonida',
      steps: ['Suis le repère jusqu’au motel.', 'Parle au réceptionniste et prends la clé.', 'Monte et repose-toi dans le lit.'],
    },
    'easy-money': {
      title: 'Argent facile',
      steps: ['Va à la station-service et gare-toi derrière.', 'Attends l’arrivée du van blanc.', 'Suis-le de loin, sinon il accélère.'],
    },
    'beach-run': {
      title: 'Course à la plage',
      steps: ['Récupère le colis sur la jetée.', 'Prends la route côtière jusqu’à la plage.', 'Sème la police en passant par les parkings.'],
    },
    'night-shift': {
      title: 'Service de nuit',
      steps: ['Attends 22 h dans le jeu.', 'Entre dans l’entrepôt par la porte latérale.', 'Neutralise les deux gardes en silence.', 'Prends le registre dans le bureau.'],
    },
    'swamp-trouble': {
      title: 'Galère dans le marais',
      steps: ['Prends un hydroglisseur au ponton.', 'Reste au milieu du canal pour éviter les alligators.', 'Utilise le fusil à pompe sur les bateaux qui te suivent.'],
    },
    'car-meet': {
      title: 'Rassemblement auto',
      steps: ['Amène n’importe quelle sportive au rassemblement.', 'Lance la première course.', 'Prends la corde dans les deux derniers virages pour gagner.'],
    },
    'pawn-shop': {
      title: 'Le prêteur sur gages',
      steps: ['Parle au patron de la boutique.', 'Poursuis le voleur à pied.', 'Coupe par la ruelle à gauche pour l’attraper avant l’avenue.'],
    },
    'high-rise': {
      title: 'La tour',
      steps: ['Prends le monte-charge jusqu’au dernier étage.', 'Pirate le panneau en associant les couleurs.', 'Redescends par l’escalier avant la fin de l’alarme.'],
    },
    'bad-deal': {
      title: 'Mauvais deal',
      steps: ['Va au rendez-vous à la marina.', 'Quand ça tire, mets-toi à couvert derrière les caisses à droite.', 'Élimine d’abord ceux sur le bateau.'],
    },
    'getaway-driver': {
      title: 'Chauffeur de fuite',
      steps: ['Attends devant la banque.', 'Quand l’équipe monte, prends tout de suite l’autoroute.', 'Change de voiture sous le passage souterrain pour perdre les étoiles.'],
    },
    'keys-escape': {
      title: 'Fuite par les Keys',
      steps: ['Roule vers le sud sur le long pont.', 'Attention au barrage au milieu.', 'Passe par la voie le long de la rambarde.'],
    },
    'old-friends': {
      title: 'Vieux amis',
      steps: ['Retrouve ton contact au diner.', 'Joue le jeu pendant la discussion.', 'Ramène-le chez lui sans abîmer la voiture.'],
    },
    'fire-sale': {
      title: 'Liquidation brûlante',
      steps: ['Verse de l’essence sur les quatre points marqués du magasin.', 'Sors et lance le briquet.', 'Pars avant l’arrivée des pompiers.'],
    },
    'air-drop': {
      title: 'Largage aérien',
      steps: ['Prends l’avion sur la piste.', 'Vole bas au-dessus du marais pour éviter le radar.', 'Largue la caisse quand la fumée verte est juste en dessous.'],
    },
    'club-night': {
      title: 'Soirée en club',
      steps: ['Mets d’abord la tenue de club.', 'Récupère le bracelet VIP auprès du barman.', 'Trouve la cible dans le salon à l’étage.'],
    },
    'hot-wheels': {
      title: 'Roues brûlantes',
      steps: ['Vole les trois voitures marquées.', 'Ramène-les au garage une par une.', 'La dernière a un traceur, fais-la repeindre d’abord.'],
    },
    'storm-warning': {
      title: 'Alerte tempête',
      steps: ['Rejoins le camping de mobil-homes avant la tempête.', 'Aide les habitants à entrer dans l’abri.', 'Prends le coffre dans le mobil-home principal.'],
    },
    'inside-man': {
      title: 'L’homme de l’intérieur',
      steps: ['Prends l’uniforme de garde à la laverie.', 'Marche lentement devant les caméras.', 'Pose l’appareil dans la salle des serveurs.'],
    },
    'double-cross': {
      title: 'Trahison',
      steps: ['Va au rendez-vous avec des renforts.', 'Quand le deal tourne mal, poursuis la voiture jusqu’aux docks.', 'Tire dans les pneus pour l’arrêter.'],
    },
    'the-big-score': {
      title: 'Le gros coup',
      steps: ['Choisis ton équipe et le plan discret.', 'Coupe le courant du bâtiment.', 'Entre par le toit et vide le coffre.', 'Fuis en bateau par le canal.'],
    },
  },
};
