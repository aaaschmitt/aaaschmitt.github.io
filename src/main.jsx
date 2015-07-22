var TopNav = React.createClass({
      render: function () {
        return (
          <div>
            <p>Hello, React! This will be a nav bar someday.</p>
          </div>
        );
      }
    });

var Another = 5
React.render(<TopNav/>, $("#top-nav").get(0));