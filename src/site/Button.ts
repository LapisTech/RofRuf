class Button extends HTMLElement
{
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { --size: calc(100vmin / 3); display: block; position: absolute; margin: auto; width: fit-content; height: fit-content; transition: top 0.5s, bottom 0.5s, left 0.5s, right 0.5s; }',
			':host > button { display: block; width: var( --size ); height: var( --size ); border-radius:50%; overflow: hidden; cursor: pointer; boxsizing: border-box; border: 0; outline: none; padding: 0; margin: 0; font-family: Icon; }',
			':host > button:before { content: var( --icon, "" ); display: block; width: 100%; height: 100%; box-sizing: border-box; text-align: center; font-size: var( --fsize, 7vmin ); }',
			':host([mode="ok"]) > button:before { content: "○"; background-color: var( --back, #34ef6e ); }',
			':host([mode="cancel"]) > button:before { content: "×"; background-color: var( --back, #ff5252 ); }',
		] ).join( '' );

		const button = document.createElement( 'button' );
		button.addEventListener( 'click', ( event ) =>
		{
			event.stopPropagation();
			const newEvent = document.createEvent( 'MouseEvent' );
			newEvent.initMouseEvent( 'click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null );
			this.dispatchEvent( newEvent );
		} );

		shadow.appendChild( style );
		shadow.appendChild( button );
	}

	protected initStyle( style: string[] ) { return style; }
}

class TopButton extends Button
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ), :host( .on ) { top: calc( var( --size ) / -2 ); }',
			':host { left: 0; right: 0; top: calc( var( --size ) * -1 ); }',
			':host > button:before { line-height: calc( var( --size ) / 2 ); padding-top: 50%; }'
		);
		return style;
	}
}

class BottomButton extends Button
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ), :host( .on ) { bottom: calc( var( --size ) / -2 ); }',
			':host { left: 0; right: 0; bottom: calc( var( --size ) * -1 ); }',
			':host > button:before { line-height: calc( var( --size ) / 2 ); padding-bottom: 50%; }'
		);
		return style;
	}
}

class LeftButton extends Button
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ), :host( .on ) { left: calc( var( --size ) / -2 ); }',
			':host { top: 0; bottom: 0; left: calc( var( --size ) * -1 ); }',
			':host > button:before { line-height: var( --size ); padding-left: 50%; }'
		);
		return style;
	}
}

class RightButton extends Button
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ), :host( .on ) { right: calc( var( --size ) / -2 ); }',
			':host { top: 0; bottom: 0; right: calc( var( --size ) * -1 ); }',
			':host > button:before { line-height: var( --size ); padding-right: 50%; }'
		);
		return style;
	}
}

class DefaultButton extends HTMLElement
{
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { --bsize: var( --size, 50vmin); display: block; margin: 5vmin; width: fit-content; height: fit-content; }',
			':host > button { display: block; width: var( --bsize ); height: var( --bsize ); overflow: hidden; cursor: pointer; boxsizing: border-box; border: 0.5vmin solid var( --border, #f7f7f7 ); background-color: var( --back, #afb1de ); border-radius: 8%; outline: none; padding: 0; margin: 0; }',
		] ).join( '' );

		const button = document.createElement( 'button' );
		button.addEventListener( 'click', ( event ) =>
		{
			event.stopPropagation();
			const newEvent = document.createEvent( 'MouseEvent' );
			newEvent.initMouseEvent( 'click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null );
			this.dispatchEvent( newEvent );
		} );
		const slot = document.createElement( 'slot' );
		button.appendChild( slot );

		shadow.appendChild( style );
		shadow.appendChild( button );
	}

	protected initStyle( style: string[] ) { return style; }
}

class IconButton extends DefaultButton
{
	protected initStyle( style: string[] )
	{
		style.push( ':host > button { font-family: Icon; }', );
		return style;
	}
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'top-button', TopButton );
	customElements.define( 'bottom-button', BottomButton );
	customElements.define( 'left-button', LeftButton );
	customElements.define( 'right-button', RightButton );
	customElements.define( 'def-button', DefaultButton );
	customElements.define( 'icon-button', IconButton );
} );
