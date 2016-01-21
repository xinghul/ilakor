+function(undefined) {
  "use strict";

  jest.dontMock("../UnreadThreadStore");
  jest.dontMock("underscore");

  console.log(123);

  describe("UnreadThreadStore", function() {

    var ChatAppDispatcher, UnreadThreadStore;
    var callback;

    beforeEach(function() {
      ChatAppDispatcher = require("../../dispatcher/AppDispatcher");
      UnreadThreadStore = require("../UnreadThreadStore");
      callback = ChatAppDispatcher.register.mock.calls[0][0];
    });

    it("registers a callback with the dispatcher", function() {
      expect(ChatAppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("provides the unread thread count", function() {
      var ThreadStore = require("../ThreadStore");
      ThreadStore.getAll.mockReturnValueOnce(
        {
          foo: {lastMessage: {isRead: false}},
          bar: {lastMessage: {isRead: false}},
          baz: {lastMessage: {isRead: true}}
        }
      );
      expect(UnreadThreadStore.getCount()).toBe(3);
    });

  });
}();
