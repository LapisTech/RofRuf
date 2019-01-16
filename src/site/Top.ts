class Top extends Page
{
	protected init()
	{
		TitleScreen.init();
		const title = <TitleScreen>this.querySelector( 'title-screen' );
		if ( !title ) { return; }// Error
		title.addEventListener( 'play', () => { this.app.showMypage(); } );
	}
}

class TitleScreen extends HTMLElement
{
	public static init()
	{
		customElements.define( 'title-screen', this );
	}

	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = [
			':host { display: block; width: 100%; height: 100%; }',
			':host > div { position: relative; width: 100%; height: 100%; }',
			':host > div > div { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: black; color: white; overflow: hidden; opacity: 1; transition: opacity 1s; }',
			':host > div > div > small { display: block; position: absolute; top: 0; bottom: 0; width: 100%; height: 1em; line-height: 1em; margin: auto; text-align: center; }',
		].join( '' );

		const wrapper = document.createElement( 'div' );

		const black1 = document.createElement( 'div' );
		black1.addEventListener( 'transitionend', () =>
		{
			wrapper.removeChild( black1 );
			wrapper.removeChild( logo );
			wrapper.removeChild( black2 );
		} );
		wrapper.appendChild( black1 );

		const logo = this.addLogo();
		logo.addEventListener( 'transitionend', () => { black1.style.opacity = '0'; } );
		wrapper.appendChild( logo );

		const black2 = document.createElement( 'div' );
		black2.addEventListener( 'transitionend', () => { logo.style.opacity = '0'; } );
		wrapper.appendChild( black2 );

wrapper.addEventListener( 'click', ( event ) =>
{
	if ( event.target !== wrapper ) { return; }
	const newEvent = new Event( 'play' );
	this.dispatchEvent( newEvent );
} );

		shadow.appendChild( style );
		shadow.appendChild( wrapper );
		setTimeout( () => { black2.style.opacity = '0'; }, 1000 );
	}

	private addLogo()
	{
		const contents = document.createElement( 'div' );

		const small = document.createElement( 'small' );
		small.textContent = 'aaa';
		contents.appendChild( small );

		return contents;
	}
}
