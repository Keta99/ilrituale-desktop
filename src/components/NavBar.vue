<template>
  <v-app-bar color="white" app dark max-height="90px" height="90px">
    <v-avatar color="#E5F1FF" size="80">
      <v-img contain alt="Avatar" src="../assets/ilrituale.jpg" />
    </v-avatar>
      <v-row justify="end" class="align-end">
        <v-col cols="auto">
          <v-btn @click="goTo('/')" fab dark medium color="teal">
            <v-icon dark>
              mdi-home
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="goTo('/calendar')" fab dark medium color="primary">
            <v-icon dark>
              mdi-calendar
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="goTo('/setting')" fab dark medium color="grey">
            <v-icon dark>
              mdi-cogs
            </v-icon>
          </v-btn>
        </v-col>
     
      </v-row>
    <!-- <v-btn color="primary" class="withoutupercase mr-3">
              <v-icon left>fas fa-home</v-icon>
              Home
          </v-btn>   -->

  </v-app-bar>
</template>

<script>
export default {
  mounted(){
    console.log(window.innerHeight);
    console.log(window.innerWidth );
   this.width = window.innerWidth 
   console.log( this.width);
  },

  data: () => ({
    width: 0,

  }),

  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },

    goTo(path ="/de"){
      if(path !== this.$route.path)
      this.$router.push({path:path})
    
    },
    onCreateEvent() {

    }
  },
  watch:{
    window:function (params) {
      console.log(params.innerWidth);
    }
  }
};
</script>
<style>
.v-btn.withoutupercase {
  text-transform: none !important;
}
</style>