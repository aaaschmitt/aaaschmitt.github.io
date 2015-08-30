/**
 * Main javascript file for the webiste
 */

/** 
 * Renders the top-nav 
 */
var navItems = 
            [
                {name: 'About', path: '/'},
                {name: 'Resume', path: '/Resume'},
                {name: 'Data-Viz', path: '/DataViz'},
                {name: 'Guides', path: '/Guides'}
            ];

function goToPath(path) {
    document.location.href = path;
}
var TopNav = React.createClass({
        render: function () {
            var navContent = [];

            navContent.push(<div className="nav-element-first" key="0">{navItems[0].name}</div>);
            for (var i = 1; i < navItems.length-1; i++) {
                navContent.push(<div className='nav-element' key={i}>{navItems[i].name}</div>);
            }
            navContent.push(<div className='nav-element-last' key={i}>{navItems[i].name}</div>);

            return (
                <div>{navContent}</div>
            );
        },

        componentDidMount: function() {
            console.log("adding handlers");
            $("*[class^='nav-element']").each(function(i) {
                $(this).on('click', function() {
                    goToPath(navItems[i].path);
                })
            })
        }
    });

React.render(<TopNav/>, $("#top-nav").get(0));