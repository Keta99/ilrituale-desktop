<template>
  <div>
    <v-card color="white" class="rounded-lg" flat>

      <v-row class="fill-height">
        <div>
          <v-row>
            <v-col v-for="user in users" :key="user.id">
              {{ user.name }}
            </v-col>
          </v-row>

        </div>
        <v-col>
          <v-sheet height="80">
            <v-btn text small color="red" @click="caricaPrenotazioni()">
              <v-icon small>
                mdi-calendar
              </v-icon>
              Carica Prenotazioni
            </v-btn>
            <v-toolbar flat>
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                Oggi
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>
                  mdi-chevron-right
                </v-icon>

              </v-btn>

              <v-toolbar-title v-if="$refs.calendar">
                <span>{{ $refs.calendar.title }}</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Giorno</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Settimana</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Mese</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-spacer></v-spacer>
              <div>
                <v-btn @click="dialog = !dialog" color="success" class="withoutupercase">
                  <v-icon left>fas fa-plus</v-icon>
                  Nuovo Appuntamento
                </v-btn>
              </div>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="700">
            <v-calendar ref="calendar" v-model="focus" color="primary" locale="it" :events="events"
              :event-color="getEventColor" :type="type" :weekdays="week" @click:event="showEvent" @click:more="viewDay"
              @click:date="viewDay" @change="getEvents" :interval-minutes="intervalloMinuti"
              :start-interval="startInterval" :first-interval="getFirstInterval()" :interval-count="getIntervalCount()"
              :interval-height="35" :interval-format="intervalFormat">
              <template #event-content="{ event }">

                <div class="custom-event" :style="{ backgroundColor: event.color }">
                  <strong>{{ event.name }}</strong>
                  <p>{{ event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} - {{
                    event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
              </template>
            </v-calendar>
            <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>

                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>


                  <!-- <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn> -->


                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col>
                     {{ selectedEvent.datail}}
                    </v-col>
                  </v-row>

                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text color="danger" @click="selectedOpen = false">
                    Chiudi
                  </v-btn>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    Sposta
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>

        </v-col>
      </v-row>
    </v-card>
    <v-dialog transition="dialog-bottom-transition" max-width="700" v-model="dialog">
      <v-card>
        <v-card-title class="justify-center">Prenotazione</v-card-title>
        <hr>
        <v-card-text>
          <v-row>
            <v-col v-if="autocomplete" cols="11">
              <v-autocomplete label="Cliente" v-model="prenotazione.cliente" :items="persone"></v-autocomplete>
            </v-col>
            <v-col v-else cols="11">
              <v-text-field label="Cliente" v-model="prenotazione.cliente"></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-checkbox v-model="autocomplete"></v-checkbox>
            </v-col>
            <v-col cols="8">
              <v-select v-model="tipologia" :items="items" multiple chips class="ma-2" label="Tipo Prenotazione"
                variant="outlined" dense hide-details>
                <template v-slot:selection="{ item, index }">
                  <v-chip :key="index" label outlined color="primary" small>
                    {{ item.text }}
                    <v-icon> mdi-chair</v-icon>
                    <v-icon> mdi-content-cut</v-icon>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            <v-col cols="4" class="mt-3">
              <template v-if="this.tipologia.includes(1)">
                <v-select v-model="lunghezzaCapelli" :items="itemslunghezza" class="ma-2" label="Lunghezza Capelli"
                  dense></v-select>
              </template>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Cellulare" v-model="prenotazione.cellulare"></v-text-field>
            </v-col>
            <v-col>
              <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="date" label="Data Appuntamento" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date" @input="menuDate = false"></v-date-picker>
              </v-menu>
              {{ data }}
            </v-col>
            <v-col>
              <v-menu v-model="menuTime" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="time" label="Orario Appuntamento" prepend-icon="mdi-clock" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" @input="menuTime = false" v-model="time">
                </v-time-picker>
              </v-menu>
              {{ time }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <div>
            {{ dataBestOccurence }}
          </div>
        </v-card-text>
        <!-- <v-card-text>
          <div>
            <v-row>
              <v-col cols="4">
                <v-checkbox label="Frequenza di 1 volta al mese nello stesso giorno"></v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox label="Frequenza di 2 volta al mese nello stesso giorno"></v-checkbox>
              </v-col>
              <v-col cols="1">
                <v-checkbox v-model="autocomplete"></v-checkbox>
              </v-col>

            </v-row>

          </div>
        </v-card-text> -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="insertPrenotazione(prenotazione)" color="success" class="withoutupercase">
            Salva
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        {{ prenotazione }}
      </v-card>

    </v-dialog>

  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data: () => ({
    dataBestOccurence: [],
    dialog: false,
    menuDate: false,
    menuTime: false,
    time: null,
    intervalloMinuti: 15,
    data: null,
    focus: '',
    tipologia: [],
    type: 'month',
    typeToLabel: {
      month: 'Mese',
      week: 'Settimana',
      day: 'Giorno'
    },

    week: [2, 3, 4, 5, 6],
    startInterval: 2,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    titles: ['Schampo Taglio Barba', 'Schampo Taglio', 'Taglio', 'Permanente'],
    events: [],
    prenotazioni: [],
    prenotazione: {
      cliente: "",
      tipologia: "",
      data: "",
      oraInizio: "",
      oraFine: "",
      name: "test",
      cellulare: "",
    },
    users: [],
    lunghezzaCapelli: [],
    persone: ["Francesco Tammaro", "Francesco mmaro", "Francesco Tamaro", "Francescomaro", "Fncesco Tammo", "Fancesco Tammro"],
    autocomplete: true,
    itemslunghezza: [
      {
        "value": 0,
        "text": "Corti"
      },
      {
        "value": 1,
        "text": "Lunghi"
      }
    ],
    items: [
      {
        "value": 0,
        "text": "Barba"
      },
      {
        "value": 1,
        "text": "Capelli"
      },
      {
        "value": 2,
        "text": "Permanente"
      },
    ],
    activePicker: null,
    date: null,
    menu: false,
  }),

  mounted() {
    console.log(this.$refs.calendar.title);
    console.log(window);
    //this.caricaPrenotazioni();
    this.type = 'day'
    console.log("PRENOTAZIONI ", this.prenotazioni);
    this.getAvailableSlotsForOperation(30)

  },
  created() {
    console.log(window);
    console.log(ipcRenderer);
  },
  methods: {
    mapValuesToText(values) {
      return values.map(value => {
        const item = this.items.find(item => item.value === value);
        return item ? item.text : 'Unknown';
      }).join('#');
    },
    caricaPrenotazioni() {
      console.log("carico");
      ipcRenderer.send('load-prenotazioni', {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners('risposta');
      console.log("ONCE");
      ipcRenderer.on('risposta', async (e, data) => {
        console.log(data);
        await data;
        console.log("Risposta ricevuta.");
      });
    },

    insertPrenotazione(prenotazione) {

      prenotazione.oraInizio =prenotazione.data + " " + prenotazione.oraInizio
      prenotazione.oraFine = prenotazione.data + " " + prenotazione.oraFine

      console.log(prenotazione);
      ipcRenderer.send('save-prenotazione', { prenotazione });
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners('risposta');
      ipcRenderer.on('risposta', async (e, data) => {
        console.log(data);

        console.log("Risposta ricevuta.");
      });
    },
    insertUser() {
      ipcRenderer.send('save-user', { name: "TEST DA NOME " + Math.random() });
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners('risposta');
      ipcRenderer.on('risposta', async (e, data) => {
        console.log(data);

        console.log("Risposta ricevuta.");
      });
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },

    setToday() {
      this.type = 'day'
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    getFirstInterval() {
      const startHour = 7; // Ora di inizio (8:00)
      const intervalMinutes = 15; // Intervallo in minuti
      return (startHour * 60) / intervalMinutes; // Conversione dell'ora in minuti
    },
    // Logica per ottenere il conteggio degli intervalli nel calendario
    getIntervalCount() {
      const startHour = 8; // Ora di inizio (8:00)
      const endHour = 21; // Ora di fine (21:00)
      const intervalMinutes = 15; // Intervallo in minuti
      return ((endHour - startHour) * 60) / intervalMinutes; // Conversione delle ore in minuti e divisione per l'intervallo
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    addEvent(prenotazione) {

      console.log(prenotazione);
    },

    getAvailableSlotsForCurrentMonth() {
      const availableSlots = [];
      const currentDate = new Date(); // Data corrente
      const currentMonth = currentDate.getMonth(); // Mese corrente
      const currentYear = currentDate.getFullYear(); // Anno corrente
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Numero di giorni nel mese corrente

      // Loop attraverso ogni giorno del mese
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const min = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8); // Inizio giornata alle 08:00
        const max = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 20, 30); // Fine giornata alle 20:30

        // Loop attraverso ogni slot disponibile durante il giorno
        let currentTime = new Date(min);
        while (currentTime < max) {
          if (
            currentTime.getHours() >= 8 && currentTime.getHours() < 20 &&
            !(currentTime.getHours() === 20 && currentTime.getMinutes() > 0)
          ) {
            availableSlots.push(new Date(currentTime)); // Aggiungi lo slot disponibile
            currentTime = new Date(currentTime.getTime() + 30 * 60000); // Passa allo slot successivo (30 minuti dopo)
          } else {
            currentTime = new Date(currentTime.getTime() + 15 * 60000); // Passa allo slot successivo (15 minuti dopo)
          }
        }
      }

      return availableSlots;
    },
    getEventsForCurrentMonth() {
      const events = [];
      const currentDate = new Date(); // Data corrente
      const currentMonth = currentDate.getMonth(); // Mese corrente
      const currentYear = currentDate.getFullYear(); // Anno corrente
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Numero di giorni nel mese corrente

      // Loop attraverso ogni giorno del mese
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        var min = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8); // Inizio giornata alle 08:00
        var max = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 20, 30); // Fine giornata alle 20:30

        // Loop attraverso ogni slot disponibile durante il giorno
        while (min < max) {
          if (
            min.getHours() >= 8 && min.getHours() < 20 &&
            !(min.getHours() === 20 && min.getMinutes() > 0)
          ) {
            events.push({
              name: "Evento",
              start: new Date(min),
              end: new Date(min.getTime() + 15 * 60000), // Durata di 15 minuti
              timed: true,
            });
            min = new Date(min.getTime() + 30 * 60000); // Passa allo slot successivo (30 minuti dopo)
          } else {
            min = new Date(min.getTime() + 15 * 60000); // Passa allo slot successivo (15 minuti dopo)
          }
        }
      }

      this.events = events;
    },

    getEvents({ start, end }) {
      const events = [];
      console.log(start);
      console.log(end);
      /* const min = new Date(`${start.date}T08:00:00`);
       const max = new Date(`${end.date}T20:30:00`);
       const days = (max.getTime() - min.getTime()) / 86400000;
       const eventCount = this.rnd(days, days + 100);
 
       const takenSlots = new Set();
 
       for (let i = 0; i < eventCount; i++) {
         let first, second;
         let attempts = 0;
         let slotTaken = true;
 
         while (slotTaken && attempts < 100) {
           const dayOffset = this.rnd(0, days) * 86400000;
           const timeOffset = this.rnd(0, (12.5 * 60 * 60 * 1000) / 900000) * 900000; // Intervalli tra 08:00 e 20:30
           first = new Date(min.getTime() + dayOffset + timeOffset);
 
           // Verifica che il primo timestamp sia tra le 08:00 e le 20:30
           if (first.getHours() < 8 || (first.getHours() >= 20 && first.getMinutes() > 0)) {
             continue;
           }
 
           const duration = this.rnd(1, 2) * 900000; // Durata di 15 minuti o 30 minuti
           second = new Date(first.getTime() + duration);
 
           // Controlla se lo slot è già occupato
           slotTaken = false;
           for (let j = first.getTime(); j < second.getTime(); j += 900000) {
             if (takenSlots.has(j)) {
               slotTaken = true;
               break;
             }
           }
           attempts++;
         }
 
         if (!slotTaken) {
           for (let j = first.getTime(); j < second.getTime(); j += 900000) {
             takenSlots.add(j);
           }
           
         }
       }*/
      ipcRenderer.send('load-prenotazioni', {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners('risposta');
      console.log("ONCE");
      ipcRenderer.once('risposta', async (e, data) => {
        console.log("data", data);
        let rows = await data

        rows.forEach(element => {
          console.log(element);
          events.push({
            name: element.cliente,
            datail: element,
            start: element.oraInizio,
            end: element.oraFine,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: true,
          });
        });
        console.log("Risposta ricevuta.");


      });
      events.push({
        name: "test",
        start: "2024-05-22 10:50",
        end: "2024-05-22 11:20",
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        timed: true,
      });



      this.events = events;
    },

    addTimeToTimeString(timeString, hoursToAdd, minutesToAdd) {
      let [hours, minutes] = timeString.split(':').map(Number);
      hours += hoursToAdd;
      minutes += minutesToAdd;
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
      hours = hours % 24;
      const paddedHours = String(hours).padStart(2, '0');
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${paddedHours}:${paddedMinutes}`;
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    intervalFormat(time) {
      //formatazione del html della data
      return time.time
    },


    getAvailableSlotsForOperation(operationTimeInMinutes) {
      // Calcoliamo il numero di slot richiesti per l'operazione
      const requiredSlots = Math.ceil(operationTimeInMinutes / 15);

      // Otteniamo gli slot disponibili per la data corrente
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const availableSlotsForCurrentDay = this.getAvailableSlotsForDate(currentYear, currentMonth, currentDay);
      console.log("requiredSlots", requiredSlots);
      // Se ci sono slot disponibili per la data corrente, li restituiamo
      if (availableSlotsForCurrentDay.length >= requiredSlots) {
        return availableSlotsForCurrentDay.slice(0, requiredSlots);
      }

      // Altrimenti, cerchiamo gli slot disponibili per le date future
      const availableSlotsForFutureDates = [];

      let searchDate = new Date(currentYear, currentMonth, currentDay + 1); // Inizia dalla data successiva
      console.log("availableSlotsForFutureDates", availableSlotsForFutureDates);
      while (availableSlotsForFutureDates.length < requiredSlots) {
        const year = searchDate.getFullYear();
        const month = searchDate.getMonth();
        const day = searchDate.getDate();

        const slotsForDate = this.getAvailableSlotsForDate(year, month, day);
        availableSlotsForFutureDates.push(...slotsForDate);

        // Passa alla data successiva
        searchDate.setDate(searchDate.getDate() + 1);
      }
      console.log(requiredSlots);
      return availableSlotsForFutureDates.slice(0, requiredSlots);
    },

    getAvailableSlotsForDate(year, month, day) {
      const availableSlots = [];
      const min = new Date(year, month, day, 8); // Inizio giornata alle 08:00
      const max = new Date(year, month, day, 20, 30); // Fine giornata alle 20:30

      // Ottieni gli eventi già presenti per la data specificata
      const eventsForDate = this.events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day;
      });

      // Loop attraverso ogni slot disponibile durante il giorno
      let currentTime = new Date(min);
      while (currentTime < max) {
        if (
          currentTime.getHours() >= 8 && currentTime.getHours() < 20 &&
          !(currentTime.getHours() === 20 && currentTime.getMinutes() > 0)
        ) {
          // Verifica se lo slot è disponibile
          const slotAvailable = !eventsForDate.some(event => {
            return currentTime >= event.start && currentTime < event.end;
          });
          if (slotAvailable) {
            availableSlots.push(new Date(currentTime)); // Aggiungi lo slot disponibile
          }
          currentTime = new Date(currentTime.getTime() + 30 * 60000); // Passa allo slot successivo (30 minuti dopo)
        } else {
          currentTime = new Date(currentTime.getTime() + 15 * 60000); // Passa allo slot successivo (15 minuti dopo)
        }
      }
      console.log("availableSlots ", availableSlots);
      return availableSlots;
    }

  },
  watch: {
    'prenotazione.data': function (params) {
      console.log(params);
    },
    'date': function (params) {
      console.log(params);
      this.prenotazione.data = params;
    },
    'time': function (params) {
      console.log(params);
      this.prenotazione.oraInizio = params;
      console.log("0", this.tipologia.includes(0));
      if (this.tipologia.includes(0)) {
        this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 20);
        this.dataBestOccurence = this.getAvailableSlotsForOperation(20);
      }

      console.log("1", this.tipologia.includes(1));

      console.log(
        this.lunghezzaCapelli
      );
      if (this.tipologia.includes(1) || this.tipologia.includes(2)) {
        if (this.lunghezzaCapelli == 0) {
          this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 20);
          this.dataBestOccurence = this.getAvailableSlotsForOperation(30);
        }
        else if (this.lunghezzaCapelli == 1) {
          this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 30);
          this.dataBestOccurence = this.getAvailableSlotsForOperation(40);

        }
      }

      console.log("2", this.tipologia.includes(2));
      if (this.tipologia.includes(0) && this.tipologia.includes(1) && this.tipologia.includes(2)) {
        this.prenotazione.oraFine = this.addTimeToTimeString(params, 1, 0);
        this.dataBestOccurence = this.getAvailableSlotsForOperation(60);
      }
    },
    tipologia: function (newVal) {
      console.log("tipologia", newVal);
      // Map array of integers to corresponding text values using the items array
      this.prenotazione.tipologia = this.mapValuesToText(newVal);
      console.log("Mapped tipologia:", this.prenotazione.tipologia);
    }
  }
}
</script>

<style>
body {
  overflow: hidden !important;
  /* Rimuove lo scroll sia orizzontale che verticale */
}
</style>