class Message extends HTMLElement
{
	private contents: HTMLElement;

	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { display: block; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: fit-content; overflow: hidden; font-size: var( --fsize, 5vmin ); z-index: var( --z-index, 2100000100 ) }',
			':host > div { width: 100%; height: fit-content; text-align: center; }',
			':host > div > div { overflow: hidden; position: relative; width: 100%; height: 0; margin: 0; transition: height 0.5s, margin 0.5s; background-color: var( --back, #4a4e5e ); }',
			':host > div > div.error { background-color: var( --error, #ff5252 ); }',
			':host > div > div.success { background-color: var( --success, #34ef6e ); }',
			':host > div > div + div { margin-top: 0.2rem; }',
		] ).join( '' );

		this.contents = document.createElement( 'div' );

		shadow.appendChild( style );
		shadow.appendChild( this.contents );
	}

	protected initStyle( style: string[] ) { return style; }

	public addMessage( message: string, time = 2000, type = '' )
	{
		const area = document.createElement( 'div' );
		if ( type ) { area.classList.add( type ); }

		const text = document.createElement( 'div' );
		text.innerHTML = message;

		area.appendChild( text );
		this.contents.appendChild( area );

		const rect = text.getBoundingClientRect();
		area.style.height = rect.height + 'px';

		area.addEventListener( 'transitionend', ( event ) =>
		{
			const rect = area.getBoundingClientRect();
			if ( rect.height < 1 ) { this.contents.removeChild( area ); }
		} );

		setTimeout( () => { area.style.height = '0'; }, time );
	}

	public errorMessage( message: string, time?: number ) { this.addMessage( message, time, 'error' ); }
	public successMessage( message: string, time?: number ) { this.addMessage( message, time, 'success' ); }

	public removeAllMessage()
	{
		const c = this.contents.children;
		for ( let i = c.length - 1 ; 0 <= i ; --i ) { (<HTMLElement>c[ i ]).style.height = '0'; }
	}

	public clear()
	{
		const c = this.contents.children;
		for ( let i = c.length - 1 ; 0 <= i ; --i ) { this.contents.removeChild( c[ i ] ); }
	}
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'system-message', Message );
} );
