// Tools
/// <reference path="./Fetch.ts" />

// Page
/// <reference path="./Page.ts" />
/// <reference path="./Top.ts" />
/// <reference path="./Main.ts" />
/// <reference path="./Egg.ts" />

// Component
/// <reference path="./Scroll.ts" />
/// <reference path="./Menu.ts" />
/// <reference path="./Button.ts" />
/// <reference path="./Item.ts" />
/// <reference path="./Modal.ts" />
/// <reference path="./Message.ts" />

// Data
/// <reference path="./User.ts" />
/// <reference path="./Ruf.ts" />

interface AppPage
{
	top: Top,
	main: Page,//Main,
	egg: Egg,
}

interface AppConfig
{
	popup: Popup,
	dialog: Dialog,
	message: Message,
	page: AppPage,//{ [ K in keyof AppPage ]: HTMLElement },
	menu:
	{
		lang: NodeListOf<HTMLElement>,
	},
}

class Language
{
	private langs: string[];
	public static DEFAULT = 'en';
	public static PATH = './lang/';
	public static SUFFIX = '';

	constructor( select?: HTMLSelectElement )
	{
		this.langs = [];

		const list: string[] = [];
		if ( navigator.languages ) { navigator.languages.forEach( ( lang ) => { list.push( lang ); } ); }
		if ( list.indexOf( Language.DEFAULT ) < 0 ) { list.push( Language.DEFAULT ); }

		const load = ( index: number ) =>
		{
			if ( list.length <= index ) { this.setEnableLanguage( select ); return; }
			const link = document.createElement( 'link' );
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.onload = () =>
			{
				this.langs.push( list[ index ] );
				load( index + 1 );
			};
			link.onerror = () => { load( index + 1 ); };
			link.href = Language.PATH + list[ index ] + '.css?' + Language.SUFFIX;
			document.head.appendChild( link );
		}
		setTimeout( ()=>{ load( 0 ); }, 0 );
	}

	public get() { return this.langs; }

	private setEnableLanguage( select?: HTMLSelectElement )
	{
		if ( select )
		{
			this.langs.forEach( ( lang ) =>
			{
				const option = document.createElement( 'option' );
				option.value = lang;
				option.textContent = lang;
				select.appendChild( option );
			} );

			select.onchange = ( event ) =>
			{
				const selected = select.selectedOptions[ 0 ];
				this.setLanguage( selected.value || 'en' );
			};
		}

		this.setLanguage( this.langs[ 0 ] || 'en' );
	}

	public setLanguage( language: string ) { document.body.lang = language; }
}

class LanguageManager
{
	private lang: Language;
	private targets: NodeListOf<HTMLElement>;
	private modal: Modal;

	constructor( targets: NodeListOf<HTMLElement>, modal: Modal )
	{
		this.lang = new Language();
		this.targets = targets;
		this.modal = modal;

		if ( document.body.lang )
		{
			this.addStyle();
			this.initObserver();
		} else
		{
			const observer = new MutationObserver( ( records ) =>
			{
				observer.disconnect();
				this.addStyle();
				this.setLanguage( document.body.lang );
				this.initObserver();
			} );
			observer.observe( document.body, { attributes: true, attributeFilter: [ 'lang' ] } );
		}

		targets.forEach( ( target ) =>
		{
			target.addEventListener( 'click', () => { this.openChooseLanguage(); } );
		} );
	}

	private addStyle()
	{
		const style = document.createElement( 'style' );
		style.innerHTML = this.lang.get().map( ( l ) => { return 'body[lang="' + l + '"] def-button[lang="' + l + '"]{--back:var(--choose-language);}'; } ).join( '' );
		document.head.appendChild( style );
	}

	private initObserver()
	{
		const observer = new MutationObserver( ( records ) =>
		{
			this.setLanguage( document.body.lang );
		} );
		observer.observe( document.body, { attributes: true, attributeFilter: [ 'lang' ] } );
	}

	public openChooseLanguage()
	{

		const contents = document.createElement( 'div' );
		this.lang.get().forEach( ( lang ) =>
		{
			const button = new DefaultButton();//document.createElement( 'button' );
			button.textContent = lang;
			button.lang = lang;
			button.addEventListener( 'click', () => { this.setLanguage( lang ); } );
			contents.appendChild( button );
		} );

		this.modal.enableOK( () => { return false; } );
		this.modal.clear();
		this.modal.appendChild( contents );
		this.modal.show();
	}

	public setLanguage( lang: string )
	{
		if ( document.body.lang !== lang ) { this.lang.setLanguage( lang ); }
		this.targets.forEach( ( target ) => { target.textContent = lang; } );
	}
}

class App
{
	private config: AppConfig;
	private lang: LanguageManager;
	private user: User;

	constructor( config: AppConfig )
	{
		this.config = config;
		this.lang = new LanguageManager( config.menu.lang, config.dialog );
		this.initPages();

		this.user = new User();

		if ( this.user.getRuf() )
		{
			this.config.page.main.show();
		} else
		{
			this.config.page.top.show();
		}

	}

	public showMypage()
	{

		if ( this.user.getRuf() )
		{
			this.goTo( 'main' );
		} else
		{
			this.config.page.egg.setUser( this.user );
			//this.config.page.egg.show();
			this.goTo( 'egg' );
			//setTimeout( () => { this.config.page.egg.showMenu(); }, 1000 );
		}
	}

	private initPages()
	{
		customElements.define( 'page-top', Top );
		customElements.define( 'page-main', Main );
		customElements.define( 'page-egg', Egg );
		Object.keys( this.config.page ).forEach( ( key: keyof AppPage ) =>
		{
			this.config.page[ key ].setApp( this );
		} );
	}

	public goTo( page: keyof AppPage )
	{
		if ( !this.config.page[ page ] ) { return false; }
		Object.keys( this.config.page ).forEach( ( key: keyof AppPage ) =>
		{
			this.config.page[ key ][ key === page ? 'show' : 'hide' ]();
		} );
	}

	public popup() { return this.config.popup; }

	public dialog() { return this.config.dialog; }

	public message() { return this.config.message; }

	public error( message: string, time?: number ) { return this.message().errorMessage( message, time ); }

	public success( message: string, time?: number ) { return this.message().successMessage( message, time ); }
}
