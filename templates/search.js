// "use strict";

// Vue.options.delimiters = ['[{', '}]'];
new Vue({
  el: '#app',
  delimiters: ["[{","}]"],
  data () {
    return {
      items: this.items,
      status: this.status
    };
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
   }
  },
  methods: {
    search: function (event) {
      event.preventDefault();

      var formData = new FormData(document.querySelector('form'));

      axios.post('/search', formData, {
        headers: {
           'Content-Type': undefined,
          // transformRequest: angular.identity,
          'X-Requested-With': 'XMLHttpRequest'
          // Accept: 'application/json'
        },
      }).then(response => {
        this.items = response.data.Items;
        // this.status = response.statusText;
        console.log(items);
      }).catch(error => {
        status = 'Error: ' + error.statusText;
        console.log('error: ' + error);
      }).finally(() => this.loading = false);
    }
  }
});
