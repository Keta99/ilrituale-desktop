<template>
  <div>
    <v-card color="white" class="rounded-lg" flat>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="100">
            <v-btn text small color="red" @click="caricaPrenotazioni()">
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
          <v-sheet height="550">
            {{ this.type }}
            {{ this.type == "day" }}
            {{ this.type == "week" }}
            {{ this.type == "month " }}
            <v-calendar ref="calendar" v-model="focus" color="primary" locale="it" :events="events"
              :event-color="getEventColor" :type="type" :weekdays="week" @click:event="showEvent" @click:more="viewDay"
              @click:date="viewDay" @change="getEvents" :interval-minutes="intervalloMinuti"
              :start-interval="startInterval" :first-interval="getFirstInterval()" :interval-count="getIntervalCount()"
              :interval-height="35" :interval-format="intervalFormat">

              <template v-slot:event="{ event }">
                <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                  <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                      <v-btn icon @click="onSpostaEvento(selectedEvent)">
                        <v-icon color="white">mdi-calendar</v-icon>
                      </v-btn>
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="onDeletePrenotazione(selectedEvent)">
                        <v-icon color="white">mdi-delete</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <span v-html="selectedEvent.details"></span>
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
                      isDay
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
                      <strong> {{ event.datail.tipologia }}</strong>
                      <tr></tr>
                      <strong v-if="event.datail.lunghezzaCapelli">
                        Capelli {{ event.datail.lunghezzaCapelli }}</strong>
                    </v-col>

                  </v-row>
                  <v-row class="pa-1" v-if="isWeek">
                    <v-col cols="6" class="text-start">
                      <tr>
                        {{
                          event.name
                        }}
                      </tr>
                      <tr>
                        {{
                          event.datail.tipologia
                        }}
                        <v-icon size="small"> fa-scissors </v-icon>

                        {{
                          event.datail.lunghezzaCapelli
                        }}
                      </tr>
                    </v-col>
                  </v-row>
                  <v-row class="justify-start" v-if="isMouth">
                    <v-col cols="6" class="text-start">
                      <strong class="ml-1" style="font-size: 12px">{{
                        event.name
                      }}</strong>
                    </v-col>
                    <!-- <v-col cols="6" class="text-end">
                        <v-icon class="pb-1 mr-1 mb-0"  size="medium"  color="white" @click="onDeletePrenotazione(selectedEvent)">mdi-delete</v-icon>
                    </v-col> -->
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
          <span>Prenotazione</span>
        </v-card-title>
        <hr />
        <v-card-text>
          <v-row>
            <v-col v-if="autocomplete" cols="11">
              <v-autocomplete label="Cliente" prepend-icon="mdi-account" v-model="prenotazione.cliente"
                :items="persone"></v-autocomplete>
            </v-col>
            <v-col v-else cols="11">
              <v-text-field label="Cliente" prepend-icon="mdi-account" v-model="prenotazione.cliente"></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-checkbox v-model="autocomplete"></v-checkbox>
            </v-col>

            <v-col cols="11">
              <v-text-field label="Cellulare" prepend-icon="mdi-phone" v-model="prenotazione.cellulare"></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-autocomplete v-model="tipologia" prepend-icon="mdi-alpha-t" :items="items" multiple class="ma-2"
                label="Tipo Prenotazione" dense hide-details>
              </v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-select :disabled="!this.tipologia.includes(1)" prepend-icon="mdi-size-l"
                v-model="prenotazione.lunghezzaCapelli" :items="itemslunghezza" class="ma-2" label="Lunghezza Capelli"
                dense></v-select>
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
            <v-col>
              <v-select :items="slotDurations" label="Seleziona durata slot" v-model="selectedSlotDuration"></v-select>
              <v-select :items="weekDays" label="Seleziona giorni della settimana" v-model="selectedWeekDays" multiple
                chips></v-select>
              <v-btn @click="getAvailableSlots">Mostra slot disponibili</v-btn>
              <v-select :items="formattedSlots" label="vedi slot" multiple chips v-model="selectedSlots"></v-select>
              {{ selectedSlots }}
              <v-list>
                <v-list-item v-for="(slot, index) in selectedSlots" :key="index">
                  {{ slot.text }}
                </v-list-item>
              </v-list>
            </v-col>
          </div>
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
    dataBestOccurence: [],
    dialog: false,
    menuDate: false,
    menuTime: false,
    intervalloMinuti: 15,
    selectedSlots: [],
    focus: "",
    tipologia: [0, 1],
    type: "week",
    isDay: false,
    isWeek: false,
    isMouth: false,
    typeToLabel: {
      month: "Mese",
      week: "Settimana",
      day: "Giorno",
    },
    week: [2, 3, 4, 5, 6],
    startInterval: 2,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: [
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
    ],
    titles: ["Schampo Taglio Barba", "Schampo Taglio", "Taglio", "Permanente"],
    events: [],
    prenotazioni: [],
    prenotazione: {
      cliente: "Francesco Tammaro",
      tipologia: "Barba#Capelli",
      data: "2024-05-24",
      oraInizio: "07:30",
      oraFine: "08:00",
      name: "test",
      cellulare: "3922827514",
      lunghezzaCapelli: "Lunghi",

    },
    data: "2024-05-25",
    time: "07:30",
    users: [],
    lunghezzaCapelli: [],
    persone: [
      "Francesco Tammaro",
      "Francesco mmaro",
      "Francesco Tamaro",
      "Francescomaro",
      "Fncesco Tammo",
      "Fancesco Tammro",
    ],
    autocomplete: true,
    itemslunghezza: ["Corti", "Lunghi"],
    items: [
      {
        value: 0,
        text: "Barba",
      },
      {
        value: 1,
        text: "Capelli",
      },
      {
        value: 2,
        text: "Permanente",
      },
    ],
    selectedSlotDuration: 30,
    selectedWeekDays: [],
    slotDurations: [20, 30, 60],
    availableSlots: [],
    weekDays: [

      { text: "Martedì", value: 2 },
      { text: "Mercoledì", value: 3 },
      { text: "Giovedì", value: 4 },
      { text: "Venerdì", value: 5 },
      { text: "Sabato", value: 6 },
    ],
    activePicker: null,
    date: null,
    menu: false,
  }),

  mounted() {
    console.log("calendar", this.$refs.calendar);

    //this.caricaPrenotazioni();

    console.log("PRENOTAZIONI ", this.prenotazioni);
    (this.type = "week"), (this.isWeek = true);
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
      this.$nextTick(() => {
        this.next(); 
        this.setWeek();
        console.log("Aggiornamento completato!");
      })
    },

    caricaPrenotazioni() {
      console.log("carico");
      ipcRenderer.send("load-prenotazioni", {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      console.log("ONCE");
      ipcRenderer.on("risposta", async (e, data) => {
        console.log(data);
        await data;
        console.log("Risposta ricevuta.");
      });
    },

    async insertPrenotazione(prenotazione) {
      console.log(prenotazione);
      ipcRenderer.send("save-prenotazione", { prenotazione });
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.on("risposta", async (e, data) => {
        console.log(data);
        console.log("Risposta ricevuta.");
      });
      this.dialog = false;
      this.resetModelPrenotazione();
      await this.getEvents();
      this.next(); 
        this.setWeek();
      this.$nextTick(() => {
        console.log("Aggiornamento completato!");
      })
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
        tipologia: "",
        data: "",
        oraInizio: "",
        oraFine: "",
        name: "test",
        cellulare: "",
      }),
        (this.time = null),
        (this.date = null),
        (this.menuDate = false),
        (this.menuTime = false),
        (this.tipologia = []);
    },

    setToday() {
      this.type = "day";
      this.focus = "";
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

    async getEvents() {
      const events = [];
      ipcRenderer.send("load-prenotazioni", {});
      // Rimuovi eventuali vecchi listener per evitare duplicati
      ipcRenderer.removeAllListeners("risposta");
      ipcRenderer.once("risposta", async (e, data) => {
        console.log("data", data);
        let rows = await data;
        if (rows.length > 0)
          rows.forEach((element) => {
            console.log(element);
            events.push({
              name: element.cliente,
              datail: element,
              start: element.data + " " + element.oraInizio,
              end: element.data + " " + element.oraFine,
              color: this.colors[this.rnd(0, this.colors.length - 1)],
              timed: true,
            });
          });
        console.log("Risposta ricevuta.");
      });
      this.events = events;
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

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    intervalFormat(time) {
      //formatazione del html della data
      return time.time;
    },

    getAvailableSlots() {
      this.availableSlots = this.calculateAvailableSlots(this.selectedSlotDuration);
    },
    calculateAvailableSlots(slotDuration) {
      const availableSlots = [];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const isSlotAvailable = (slotStart, slotEnd) => {
        const slotStartDate = new Date(slotStart);
        const slotEndDate = new Date(slotEnd);

        return !this.events.some((event) => {
          const eventStartDate = new Date(event.start);
          const eventEndDate = new Date(event.end);

          // Verifica se lo slot si sovrappone con un evento
          return slotStartDate < eventEndDate && slotEndDate > eventStartDate;
        });
      };

      for (let day = currentDay; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const dayOfWeek = currentDate.getDay();

        if (!this.selectedWeekDays.includes(dayOfWeek)) {
          continue;
        }

        const min = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          8
        );
        const max = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          20,
          30
        );
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
        console.log(params);
        this.prenotazione.data = params;
      }
    },
    time: function (params) {
      if (params) {
        console.log(params);
        this.prenotazione.oraInizio = params;
        console.log("0", this.tipologia.includes(0));
        if (this.tipologia.includes(0)) {
          this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 20);

        }
        console.log("1", this.tipologia.includes(1));
        console.log(this.lunghezzaCapelli);
        if (this.tipologia.includes(1) || this.tipologia.includes(2)) {
          if (this.lunghezzaCapelli === "Corti") {
            this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 20);

          } else if (this.lunghezzaCapelli === "Lunghi") {
            this.prenotazione.oraFine = this.addTimeToTimeString(params, 0, 30);

          }
        }

        console.log("2", this.tipologia.includes(2));
        if (
          this.tipologia.includes(0) &&
          this.tipologia.includes(1) &&
          this.tipologia.includes(2)
        ) {
          this.prenotazione.oraFine = this.addTimeToTimeString(params, 1, 0);
          this.dataBestOccurence = this.getAvailableSlotsForOperation(60);
        }
      }
    },
    tipologia: function (newVal) {
      if (newVal) {
        console.log("tipologia", newVal);
        // Map array of integers to corresponding text values using the items array
        this.prenotazione.tipologia = this.mapValuesToText(newVal);
        console.log("Mapped tipologia:", this.prenotazione.tipologia);
        if (!newVal.includes(1)) {
          this.prenotazione.lunghezzaCapelli = "";
        }
      }
    },
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
