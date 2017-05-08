<template>
  <div class="left-side">
    <div class="tool-bar">
      <!-- Tool bar -->
      <ul class="horizontal-ul">
        <li class="file"><span class="glyphicon glyphicon-file"></span></li>
        <li><span class="glyphicon glyphicon-repeat"></span></li>
        <li><span class="glyphicon glyphicon-comment"></span></li>
        <li><span class="glyphicon glyphicon-trash"></span></li>
      </ul>
      <!-- end tool bar -->
    </div>
    <!-- word counter -->
    <div class="tool-render">
      <div class="count">
        <p>count: <span> {{wordCount}} </span></p>
      </div>
    </div>
  </div>
  <!-- end word counter -->
</template>

<script>
  import Methods from '../js/tool_bar.js'
  import auth from '../js/auth.js'

  export default{
    created() {
    },
    data() {
      return {
        test: 'tool-bar'
      }
    },
    props: ['wordCount'],
      // Methods are located in js directory
      methods: Methods
    }
</script>