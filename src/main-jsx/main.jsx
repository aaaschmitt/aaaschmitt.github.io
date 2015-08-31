/**
 * Main javascript file for the webiste
 */

function getCenterXCoordOfElement(element) {
    var offset = element.offset(),
        width = element.width(),
        height = element.height();

    var centerX = offset.left + width / 2;

    return centerX;
}

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
            var navContent = [],
                name = "";

            name = navItems[0].name;
            navContent.push(<div className="nav-element-first" data-navname={name} key="0">{name}</div>);
            for (var i = 1; i < navItems.length-1; i++) {
                name = navItems[i].name;
                navContent.push(<div className='nav-element' data-navname={name} key={i}>{name}</div>);
            }
            name = navItems[i].name;
            navContent.push(<div className='nav-element-last' data-navname={name} key={i}>{name}</div>);

            return (
                <div>{navContent}</div>
            );
        },

        componentDidMount: function() {
            $("*[data-navname='" + pageName + "']").css('color', '#FFED00');
            $("*[class^='nav-element']").each(function(i) {
                $(this).on('click', function() {
                    goToPath(navItems[i].path);
                })
            })

            //add spaceship movement handlers if it exists
            var spaceship = $('#spaceship-img');
            if (spaceship.length) {

                $("*[class^='nav-element']").on('mouseenter', function() {
                    var centerX = getCenterXCoordOfElement($(this));
                    spaceship.animate({'left': (centerX - ($(window).width() / 2)) + "px"}, 1000/60);
                });
                $("*[class^='nav-element']").on('mouseleave', function() {
                    spaceship.animate({'left': 0 + "px"}, 1000/60);
                });
            }
        }
    });

React.render(<TopNav/>, $("#top-nav").get(0));