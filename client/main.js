// <!-- Created by Duncan on 12.28.2016 -->
import Vue from 'vue'
import Navbar from './vue-components/navbar.vue'
import MainContent from './vue-components/main_content.vue'

new Vue({
  el: 'navbar',
  components: { Navbar }
}),

new Vue({
  el: 'main-content',
  data: {input: null, count: null},
  components: { MainContent }
});
// For testing only
module.exports = {}
