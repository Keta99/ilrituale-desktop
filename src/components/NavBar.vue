<template>
  <v-app-bar color="white" app dark max-height="90px" height="90px">
    <!-- <v-icon color="black">fas fa-long-arrow-alt-left</v-icon> -->
    <div class="mt-2">
      <h3 class="black--text ">Agenda Appuntamenti</h3>
    </div>

    <v-spacer></v-spacer>
    <v-avatar color="#E5F1FF" size="80">
      <v-img contain alt="Avatar" src="../assets/ilrituale.jpg" />
    </v-avatar>
    <v-spacer></v-spacer>
  
    <!-- <v-btn color="primary" class="withoutupercase mr-3">
              <v-icon left>fas fa-home</v-icon>
              Home
          </v-btn>   -->
  
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
  
   
  }),

  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },
    onCreateEvent() {

    }
  }
};
</script>
<style>
.v-btn.withoutupercase {
  text-transform: none !important;
}
</style>