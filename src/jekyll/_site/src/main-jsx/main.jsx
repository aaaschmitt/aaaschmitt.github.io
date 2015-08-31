/**
 * Main javascript file for the webiste
 */

/** 
 * Renders the top-nav 
 */
var navItems = ['About', 'Resume', 'Data-Viz', 'Guides'];
var TopNav = React.createClass({
        render: function () {
            var navContent = [];

            navContent.push(<div className="nav-element-first" key="0">{navItems[0]}</div>);
            for (var i = 1; i < navItems.length-1; i++) {
                navContent.push(<div className='nav-element' key={i}>{navItems[i]}</div>);
            }
            navContent.push(<div className='nav-element-last' key={i}>{navItems[i]}</div>);

            return (
                <div id="top-nav">
                    {navContent}
                </div>
            );
        }
    });

React.render(<TopNav/>, $("#top-nav").get(0));