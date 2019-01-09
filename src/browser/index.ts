/// <reference path="./App.ts" />



document.addEventListener( 'DOMContentLoaded', () =>
{
	const app = new App(
	{
		main: <HTMLElement>document.getElementById( 'main' ),
		egg: <HTMLElement>document.getElementById( 'egg' ),
	} );
} );
