<template>
  <div>
    <v-card color="white" class="rounded-lg" flat>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="100">
            <v-btn text small color="primary" @click="getEvents()">
              <v-icon small> mdi-calendar </v-icon>
              Carica Prenotazioni
            </v-btn>
            <v-toolbar flat>
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                Oggi
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                <span>{{ $refs.calendar.title }}</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
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
          <v-sheet height="600">
            <v-calendar ref="calendar" v-model="focus" color="primary" locale="it" :events="events"
              :start="dataInizioCalendario" :end="dataFineCalendario" :event-color="getEventColor" :type="type"
              :weekdays="week" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="getEvents"
              :interval-minutes="intervalloMinuti" :first-interval="getFirstInterval()"
              :interval-count="getIntervalCount()" :interval-height="50" :interval-format="intervalFormat">
              <template v-slot:event="{ event }">
                <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                  <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="onDeletePrenotazione(selectedEvent)">
                        <v-icon color="white">mdi-delete</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <span>{{ selectedEvent }}</span>
                      <span>ORARIO ? </span>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text color="secondary" @click="selectedOpen = false">
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <div class="custom-event">
                  <v-row class="justify-center" v-if="isDay">
                    <v-col cols="3" class="text-center">
                      <strong style="font-size: 15px">{{ event.name }}</strong>
                      <tr></tr>
                      <strong style="font-size: 15px">{{
                        event.datail.cellulare
                      }}</strong>
                    </v-col>
                    <v-col cols="3" class="text-center">
                      <strong style="font-size: 20px">
                        {{ event.datail.oraInizio }} - {{ event.datail.oraFine }}</strong>
                    </v-col>
                    <v-col cols="3" class="text-center">
                      <strong> {{ event.datail.note }}</strong>
                    </v-col>
                  </v-row>
                  <v-row class="pa-1" v-if="isWeek">
                    <v-col cols="12" class="text-start">
                      <h1 style="font-size: large;" class="text-center">
                        {{ event.name }}
                      </h1>
                      <hr>
                      <h6 style="margin: 5px;">
                        <v-row>
                          <v-col cols="2">

                          </v-col>
                        </v-row>
                      </h6>
                    </v-col>
                  </v-row>
                  <v-row class="justify-start" v-if="isMouth">
                    <v-col cols="6" class="text-start">
                      <strong class="ml-1" style="font-size: 12px">{{
                        event.name
                      }}</strong>
                    </v-col>
                  </v-row>
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog transition="dialog-bottom-transition" max-width="768" v-model="dialog">
      <v-card max-width="768">
        <v-card-title class="justify-center">
          <h2>Prenotazione</h2>
        </v-card-title>
        <hr class="mr-4 ml-4" />
        <v-card-text class="pa-3">
          <v-card-text>
            <v-row class="pa-1">
              <v-col v-if="autocomplete" cols="11">
                <v-autocomplete label="Cliente" prepend-icon="mdi-account" append-icon="fa-scissors"
                  v-model="prenotazione.cliente" :items="clienti"></v-autocomplete>
              </v-col>
              <v-col v-else cols="11">
                <v-text-field label="Cliente" prepend-icon="mdi-account" v-model="prenotazione.cliente"></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-switch v-model="autocomplete"></v-switch>
              </v-col>
              <v-col cols="11">
                <v-text-field label="Cellulare" prepend-icon="mdi-phone"
                  v-model="prenotazione.cellulare"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="date" label="Data Appuntamento" prepend-icon="mdi-calendar" readonly
                      v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="date" @input="menuDate = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="5">
                <v-menu v-model="menuTime" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="time" label="Orario Appuntamento" prepend-icon="mdi-clock" readonly
                      v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-time-picker format="24hr" @input="menuTime = false" v-model="time">
                  </v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="1">
              </v-col>
              <v-col cols="1">
              </v-col>
              <v-col cols="11" style="display: flex; justify-content: center">
                <span style="font-size: 15px;">Frequenza in un Anno</span>
              </v-col>
              <v-col cols="1">
              </v-col>
              <v-col cols="3">
                <v-switch v-model="prenotazione.recurring" color="red darken-3">
                  <template v-slot:label>
                    <span>Abituale</span>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="5" class="mt-4">
                <v-slider :disabled="!prenotazione.recurring" hint="Settimane" thumb-label="always"
                  v-model="prenotazione.frequenza" max="12" min="1"
                  :persistent-hint="prenotazione.recurring"></v-slider>
              </v-col>
              <v-col cols="2">
                <span>{{ pfText }}</span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <div>CALCOLO MIGLIORE SLOT
              <v-row>
                <v-col>
                  <v-select :items="weekDays" label="Seleziona giorni della settimana" v-model="selectedWeekDays"
                    multiple chips></v-select>
                  <v-btn @click="getAvailableSlots">Mostra slot disponibili</v-btn>
                  <v-select :items="formattedSlots" label="vedi slot" chips v-model="selectedSlots"></v-select>
                  {{ selectedSlots }}
                  <v-list>
                    <v-list-item v-for="(slot, index) in selectedSlots" :key="index">
                      {{ slot.text }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-btn class="withoutupercase" color="red" style="color: white" @click="resetModelPrenotazione">
            Reset
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="insertPrenotazione(prenotazione)" color="success" class="withoutupercase">
            Salva
          </v-btn>
        </v-card-actions>
        {{ prenotazione }}
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    dataInizioCalendario: "2024-05-10",
    dataFineCalendario: "2024-05-31",
    intervalloMinuti: 30,
    oraInizioLavoro: 6,
    oraFineLavoro: 21,
    colors: ["red",
      "teal",
      "light-blue",
      "lime",
      "amber",
      "blue-grey",
      "deep-orange",
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
      "primary",
      "pink",
      "purple",
      "red darken-1",
      "teal darken-1",
      "light-blue darken-1",
      "lime darken-1",
      "amber darken-1",
      "blue-grey darken-1",
      "deep-orange darken-1",
      "blue darken-1",
      "indigo darken-1",
      "deep-purple darken-1",
      "cyan darken-1",
      "green darken-1",
      "orange darken-1",
      "grey darken-2",
      "primary darken-1",
      "pink darken-1",
      "purple darken-1",
      "red darken-2",
      "teal darken-2",
      "light-blue darken-2",
      "lime darken-2",
      "amber darken-2",
      "blue-grey darken-2",
      "deep-orange darken-2",
      "blue darken-2",
      "indigo darken-2",
      "deep-purple darken-2",
      "cyan darken-2",
      "green darken-2",
      "orange darken-2",
      "grey darken-3",
      "primary darken-2",
      "pink darken-2",
      "purple darken-2"
    ],

    dialog: true,

    manual: false,
    dataBestOccurence: [],

    menuDate: false,
    menuTime: false,

    selectedSlots: [],
    type: "week",
    focus: "",
    isDay: false,
    isWeek: false,
    isMouth: false,
    typeToLabel: {
      month: "Mese",
      week: "Settimana",
      day: "Giorno",
    },
    week: [2, 3, 4, 5, 6],
    weekDays: [
      { text: "Martedì", value: 2 },
      { text: "Mercoledì", value: 3 },
      { text: "Giovedì", value: 4 },
      { text: "Venerdì", value: 5 },
      { text: "Sabato", value: 6 },
    ],
    startInterval: 3,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    prenotazioni: [],
    date: null,
    prenotazione: {
      cliente: "Francesco Tammaro",
      note: "Barba e Capelli",
      dataOraInizio: "",
      dataOraFine: "",
      name: "test",
      cellulare: "3922827514",
      recurring: false,
      recurringGruppId: 0,
      frequenza: 0 //  0 numero settimane prenotazione riservata ! 
    },
    pfText: "",
    data: "2024-05-28",
    time: "07:30",
    clienti: [],
    autocomplete: true,
    selectedWeekDays: [],
    availableSlots: [],

    activePicker: null,

    menu: false,
  }),

  mounted() {
    console.log("calendar", this.$refs.calendar);
    setInterval(() => {
      this.reload()
    }, 3600000); // 1000 ms = 1 secondo
    this.setToday();
    (this.isDay = true);


  },
  created() {
    console.log(window);
    console.log(ipcRenderer);
    this.type = "day";
  },
  computed: {
    formattedSlots() {
      return this.availableSlots.map((slot) => ({
        text: `${slot.start} - ${slot.end}`,
        value: slot,
      }));
    },
  },
  methods: {
    reload() {
      ipcRenderer.send("reload");
    },
    async getEvents() {
      const events = [];
      ipcRenderer.send("load-prenotazioni", {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.once("risposta", async (e, data) => {
        let rows = await data;
        if (rows.length > 0)
          rows.forEach((element) => {
            console.log(element);
            events.push({
              name: element.cliente,
              datail: element,
              start: element.dataOraInizio,
              end: element.dataOraFine,
              color: this.colors[this.rnd(0, this.colors.length - 1)],
              timed: true,
            });
          });
        console.log("Risposta ricevuta.");
      });
      this.events = events;
    },
    async getClienti() {
      ipcRenderer.send("load-clienti", {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.once("risposta", async (e, data) => {
        const clienti = data;
        console.log("clienti", clienti);
      });
    },

    async insertPrenotazione(prenotazione) {
      console.log(prenotazione);
      console.log(this.selectedSlots); 
      let dataOraInizio = "";
      let dataOraFine = "";
      if(this.selectedSlots){
          dataOraInizio = this.selectedSlots.start;
         dataOraFine = this.selectedSlots.end;
      }else{
        dataOraInizio =  prenotazione.data + " " + prenotazione.oraInizio,
        dataOraFine = prenotazione.data + " " + prenotazione.oraFine
      }
      let prenotazioneSend = {
        cliente: prenotazione.cliente,
        dataOraInizio:dataOraInizio,
        dataOraFine: dataOraFine,
        cellulare: prenotazione.cellulare,
        note:"e",
        recurringGruppId: 0,
        recurring: false,
        frequenza: 0
      }
      ipcRenderer.send("save-prenotazione", { prenotazioneSend });
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.on("risposta", async (e, data) => {
        console.log(data);
        console.log("Risposta ricevuta.");
      });
      /*this.dialog = false;
      this.resetModelPrenotazione();
      await this.getEvents();
      this.reload();*/
    },
    async onDeletePrenotazione(prenotazione) {
      console.log("delete", prenotazione);
      let id = prenotazione.datail.id;
      ipcRenderer.send("delete-prenotazione", { id: id });
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.on("risposta", async (e, data) => {
        console.log(data);
      });
      await this.getEvents();
      this.reload();
    },






    mapValuesToText(values) {
      return values
        .map((value) => {
          const item = this.items.find((item) => item.value === value);
          return item ? item.text : "Unknown";
        })
        .join("#");
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    resetModelPrenotazione() {
      (this.prenotazione = {
        cliente: "",
        note: "",
        dataOraInizio: "",
        dataOraFine: "",
        name: "test",
        cellulare: "",
        recurringGruppId: 0,
        recurring: false,
        frequenza: 0 //  0 numero settimane prenotazione riservata ! 
      }),
        (this.time = null),
        (this.date = null),
        (this.menuDate = false),
        (this.menuTime = false)
    },

    setToday() {
      this.type = "day";
      this.focus = this.$refs.calendar.times.today.date;
    },
    setWeek() {
      this.type = "week";
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    getFirstInterval() {
      const startHour = this.oraInizioLavoro; // Ora di inizio (8:00)
      const intervalMinutes = this.intervalloMinuti; // Intervallo in minuti
      return (startHour * 60) / intervalMinutes; // Conversione dell'ora in minuti
    },
    // Logica per ottenere il conteggio degli intervalli nel calendario
    getIntervalCount() {
      const startHour = this.oraInizioLavoro; // Ora di inizio (8:00)
      const endHour = this.oraFineLavoro; // Ora di fine (21:00)
      const intervalMinutes = this.intervalloMinuti; // Intervallo in minuti
      return ((endHour - startHour) * 60) / intervalMinutes; // Conversione delle ore in minuti e divisione per l'intervallo
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    addEvent(prenotazione) {
      console.log(prenotazione);
    },



    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    intervalFormat(time) {
      return time.time;
    },

    getAvailableSlots() {
      this.availableSlots = this.calculateAvailableSlots(30);
    },
    calculateAvailableSlots(slotDuration) {
      const availableSlots = [];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();
      // const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


      const isSlotAvailable = (slotStart, slotEnd) => {
        const slotStartDate = new Date(slotStart);
        const slotEndDate = new Date(slotEnd);
        return !this.events.some((event) => {
          const eventStartDate = new Date(event.start);
          const eventEndDate = new Date(event.end);
          return slotStartDate < eventEndDate && slotEndDate > eventStartDate;
        });
      };
      let mounthCalcolo = currentMonth;
      let dayCalcolo = currentDay;
      let yearCalcolor = currentYear;
      let fistRun = false;
      while (availableSlots.length == 0) {

     
        if (fistRun) {
          if (availableSlots.length == 0) {
            if (mounthCalcolo == 12) {
              mounthCalcolo = 1
            } else {
              mounthCalcolo += 1
              console.log(mounthCalcolo + "mounthCalcolo");
            }
            dayCalcolo = 1;
          }
        }
        fistRun = true;
        const daysInMonthCalcolo = new Date(yearCalcolor, mounthCalcolo + 1, 0).getDate();
        for (let day = dayCalcolo; day <= daysInMonthCalcolo; day++) {
          const currentDateCalcolo = new Date(yearCalcolor, mounthCalcolo, day)
          console.log("currentDateCalcolo", currentDateCalcolo);
          const dayOfWeek = currentDateCalcolo.getDay();
          if (!this.selectedWeekDays.includes(dayOfWeek)) {
            console.log("continue");
            continue;
          }
          const min = new Date(
            currentDateCalcolo.getFullYear(),
            currentDateCalcolo.getMonth(),
            currentDateCalcolo.getDate(),
            6,
            30
          );
          const max = new Date(
            currentDateCalcolo.getFullYear(),
            currentDateCalcolo.getMonth(),
            currentDateCalcolo.getDate(),
            20,
            30
          );
          console.log("min" + min);
          console.log("max" + max);
          let currentTime = new Date(min);
          while (currentTime < max) {
            const slotStart = this.formatDate(currentTime);
            const slotEnd = this.formatDate(
              new Date(currentTime.getTime() + slotDuration * 60000)
            );
            if (slotEnd <= this.formatDate(max) && isSlotAvailable(slotStart, slotEnd)) {
              availableSlots.push({ start: slotStart, end: slotEnd });
            }
            currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
          }
        }
      }
      return availableSlots;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    addTimeToTimeString(timeString, hoursToAdd, minutesToAdd) {
      let [hours, minutes] = timeString.split(":").map(Number);
      hours += hoursToAdd;
      minutes += minutesToAdd;
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
      hours = hours % 24;
      const paddedHours = String(hours).padStart(2, "0");
      const paddedMinutes = String(minutes).padStart(2, "0");
      return `${paddedHours}:${paddedMinutes}`;
    },
  },
  watch: {
    type: function (params) {
      switch (params) {
        case "day":
          this.isDay = true;
          this.isWeek = false;
          this.isMouth = false;
          break;
        case "week":
          this.isWeek = true;
          this.isDay = false;
          this.isMouth = false;
          break;
        case "month":
          this.isMouth = true;
          this.isWeek = false;
          this.isDay = false;
          break;
        default:
          this.isDay = true;
          this.isWeek = false;
          this.isMouth = false;
          break;
      }
    },
    "prenotazione.data": function (params) {
      if (params) {
        console.log(params);
      }
    },
    date: function (params) {
      if (params) {
        this.prenotazione.dataOraInizio = params;
        this.prenotazione.dataOraFine = params;
      }
    },
    time: function (params) {
      if (params) {
        console.log(params);
        let data = this.prenotazione.dataOraInizio;
        this.prenotazione.dataOraInizio = data + " " + params;
        const oraFine = this.addTimeToTimeString(params, 0, 30);
        this.prenotazione.dataOraFine = data + " " + oraFine;

      }
    },
    'prenotazione.recurring': function (params) {

      console.log(params);
      if (params) {
        this.prenotazione.frequenza = 1;
      } else {
        this.prenotazione.frequenza = 0;
      }
    },
    '$ref.calendar': function (params) {
      if (params) {
        console.log("Calendar Watch", params);
      }
    }
  },
};
</script>

<style>
.text-center {
  text-align: center;
}

body {
  overflow: hidden !important;
  /* Rimuove lo scroll sia orizzontale che verticale */
}
</style>
