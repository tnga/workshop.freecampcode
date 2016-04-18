/**
*  Markdown Previewer - for freeCodeCamp.com
*        
* by tnga <http://freeCodeCamp.com/tnga> - 2016
*
* awesome md-editor using React, IUI & simplemde
*
**********************************************************************
* It isn't necessary to use jsx synthax and Babel for few code lines !
* Maybe will reconsider it if the project become big.
**********************************************************************
*/

var DisplayContainer = React.createClass({
    
    getInitialState: function getInitialState() {
        return {
            editorID: "md-editor" ,
            simplemde: null ,
            value:'Heading\n=======\n\nSub-heading\n-----------\n \n### Another deeper heading\n \nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  \nline break\n\nText attributes *italic*, **bold**, \n`inline code`, ~~strikethrough~~ . \n ``` \n //block code \n var message = "hello world"; \n alert( message ); \n console.log("camper-bot send a message"); \n ``` \n\nShopping list:\n\n  * apples\n  * oranges\n  * pears\n\nNumbered list:\n\n  1. apples\n  2. oranges\n  3. pears \n\nShortcut | Action \n :------- | :----- \n *Cmd-* | "toggleBlockquote" \n *Cmd-B* | "toggleBold" \n *Cmd-E* | "cleanBlock" \n *Cmd-H* | "toggleHeadingSmaller" \n *Cmd-I* | "toggleItalic" \n *Cmd-K* | "drawLink" \n *Cmd-L* | "toggleUnorderedList" \n *Cmd-P* | "togglePreview" \n *Cmd-Alt-C* | "toggleCodeBlock" \n *Cmd-Alt-I* | "drawImage" \n *Cmd-Alt-L* | "toggleOrderedList" \n *Shift-Cmd-H* | "toggleHeadingBigger" \n *F9* | "toggleSideBySide" \n *F11* | "toggleFullScreen" \n\n *by [tnga](https://github.com/tnga)*'
        }
    },
    componentDidMount: function componentDidMount() {
        //init simplemde lib
        this.setState({
            simplemde: new SimpleMDE({ 
                element: document.getElementById( this.state.editorID ),
                initialValue: this.state.value 
            })
            } ,
            function () {
                this.state.simplemde.toggleFullScreen() ; //full page by default (like popover)
            }
        ) ;
    },
    render: function render() {
        return  React.createElement( RawInput ,
                    {id: this.state.editorID} 
               ) ;
    }
});

var RawInput = React.createClass({
   
    render: function render() {
        return  React.createElement("textarea" ,
                    {rows: "22",  type: "text", id: this.props.id } 
               ) ;
    }
});

ReactDOM.render(React.createElement(DisplayContainer, null), document.getElementById("display"));