/// <reference path="./App.ts" />



document.addEventListener( 'DOMContentLoaded', () =>
{
	const app = new App(
	{
		popup: <Popup>document.getElementById( 'popup' ),
		main: <HTMLElement>document.getElementById( 'main' ),
		egg: <HTMLElement>document.getElementById( 'egg' ),
	} );
} );
