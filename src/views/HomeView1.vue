<template>
        <v-app
          id="inspire"
          :style="{ background: $vuetify.theme.themes.dark.background }"
        >
            <NavBar/>
              <router-view />
        </v-app>
             <!-- <SideBar></SideBar> -->
      </template>
      
      <script>
      
      // @ is an alias to /src
      // import SideBar from "@/components/SideBar.vue";
      import NavBar from "../components/NavBar.vue";
      //  import InfoPage from "../components/InfoPage.vue";
      // import AgendaPage from "../components/AgendaPage.vue";
      //  import DoctorPage from "../components/DoctorPage.vue";
      export default {
        data: () => ({
          
        }),
       
      
        components: {
          // SideBar,
            NavBar,
            // InfoPage,
          //  DoctorPage,
          // AgendaPage
      },
      };
      </script>