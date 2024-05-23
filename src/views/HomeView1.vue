<template>
        <v-app
          id="inspire"
          :style="{ background: $vuetify.theme.themes.dark.background }"
        >
        <NavBar/>
         <v-row class="pa-3">
              <v-col cols="12" sm="12">
                <!-- <InfoPage/> -->
                <v-row>
                  <v-col cols="12" sm="12">
                    <AgendaPage />
                  </v-col>
                </v-row>
              </v-col>
            </v-row> 
          
        </v-app>
             <!-- <SideBar></SideBar> -->
      </template>
      
      <script>
      
      // @ is an alias to /src
      // import SideBar from "@/components/SideBar.vue";
      import NavBar from "../components/NavBar.vue";
      //  import InfoPage from "../components/InfoPage.vue";
      import AgendaPage from "../components/AgendaPage.vue";
      //  import DoctorPage from "../components/DoctorPage.vue";
      export default {
        data: () => ({
          
        }),
       
      
        components: {
          // SideBar,
            NavBar,
            // InfoPage,
          //  DoctorPage,
          AgendaPage
      },
      };
      </script>