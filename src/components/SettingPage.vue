<template>
  <v-container>
    <v-sheet height="100">
    <v-row>
      <v-col>
        <v-calendar
          ref="calendar"
          v-model="selectedDate"
          :events="events"
          color="primary"
          type="day"
        ></v-calendar>
      </v-col>
      <v-col>
        <v-select
          :items="slotDurations"
          label="Seleziona durata slot"
          v-model="selectedSlotDuration"
        ></v-select>
        <v-select
          :items="weekDays"
          label="Seleziona giorni della settimana"
          v-model="selectedWeekDays"
          multiple
          chips
        ></v-select>
        <v-btn @click="getAvailableSlots">Mostra slot disponibili</v-btn>
        <v-select
          :items="formattedSlots"
          label="vedi slot"
          multiple
          chips
          v-model="selectedSlots"
        ></v-select>
        <v-list>
          <v-list-item v-for="(slot, index) in selectedSlots" :key="index">
            {{ slot.text }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-sheet>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: new Date(),
      selectedSlotDuration: 30,
      slotDurations: [20, 30, 60],
      weekDays: [
        { text: "Lunedì", value: 1 },
        { text: "Martedì", value: 2 },
        { text: "Mercoledì", value: 3 },
        { text: "Giovedì", value: 4 },
        { text: "Venerdì", value: 5 },
        { text: "Sabato", value: 6 },
        { text: "Domenica", value: 0 },
      ],
      selectedWeekDays: [2, 3, 4, 6], // Valori predefiniti (Martedì, Mercoledì, Giovedì, Sabato)
      events: [
        {
          name: "test",
          start: "2024-05-24 07:30",
          end: "2024-05-24 08:00",
          timed: true,
        },
        {
          name: "test",
          start: "2024-05-24 08:30",
          end: "2024-05-24 09:00",
          timed: true,
        },
        {
          name: "test",
          start: "2024-05-24 09:00",
          end: "2024-05-24 09:30",
          timed: true,
        },
        {
          name: "test",
          start: "2024-05-24 09:30",
          end: "2024-05-24 10:30",
          timed: true,
        },
        {
          name: "test",
          start: "2024-05-24 10:30",
          end: "2024-05-24 10:50",
          timed: true,
        },
      ],
      availableSlots: [],
      selectedSlots: [],
    };
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
};
</script>
