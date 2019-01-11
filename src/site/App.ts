// Page
/// <reference path="./Page.ts" />
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

interface AppConfig
{
	popup: Popup,
	dialog: Dialog,
	message: Message,
	main: HTMLElement,
	egg: HTMLElement,
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
console.log( 'Language list:', list );
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

class App
{
	private config: AppConfig;
	private lang: Language;
	private user: User;
	private egg: Egg;

	constructor( config: AppConfig )
	{
		this.config = config;
		this.lang = new Language();

		this.user = new User();

		this.egg = new Egg( this, config.egg );

		if ( this.user.getRuf() )
		{
			this.egg.hide();
		} else
		{
			this.egg.setUser( this.user );
			this.egg.show();
			setTimeout( () => { this.egg.showMenu(); }, 1000 );
		}

	}

	public popup() { return this.config.popup; }

	public dialog() { return this.config.dialog; }

	public message() { return this.config.message; }

	public error( message: string, time?: number ) { return this.message().errorMessage( message, time ); }

	public success( message: string, time?: number ) { return this.message().successMessage( message, time ); }
}
