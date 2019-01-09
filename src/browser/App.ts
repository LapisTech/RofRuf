/// <reference path="./Page.ts" />
/// <reference path="./Egg.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Menu.ts" />
/// <reference path="./Button.ts" />

interface AppConfig
{
	main: HTMLElement,
	egg: HTMLElement,
}

class App
{
	private user: User;
	private egg: Egg;

	constructor( config: AppConfig )
	{
		this.user = new User();

		this.egg = new Egg( config.egg );

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
}
