var events = {}

module.exports = {
    on: function(event,cb) {
        //adds to the events hash at key `event`
        //if no events regestered, make new array, otherwise push
        if(typeof events[event] === 'undefined') {
            events[event] = [cb];
        } else {
            events[event].push(cb);
        }
    },
    trigger: function(event, data) {
        //look up key `event` in events. iterate over the functions and call them
        if(events[event]) {
          events[event].forEach(function(fn) {
              fn(data);
          });
        }
    }
}
