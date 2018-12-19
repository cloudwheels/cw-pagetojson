/* eslint-disable max-len */
import AbstractToJson, {convert} from '../src/AbstractToJson';

/*
process.on('unhandledRejection', up => {
    throw up;
});
*/
describe('AbstractToJson testing', function() {
  // eslint-disable-next-line no-unused-vars
  const html = '';

  it('Trying to create an instance of AbstractToJson should throw an exception', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const a = new AbstractToJson();
    }).toThrow('Constructor invocation not allowed on abstract class');
  });

  it('calls convert and expects an exception', () => {
    expect(convert).toThrow('Not callable on abstract class');
  });
/* removed by cloudwheels
    it('calls convertUrl and expects an exception', async () => {
        //expect.assertions(1);
        try {
            await AbstractToJson.convertUrl();
        } catch (err) {
            expect(err).toMatch('Not callable on abstract class');
        }
    });

    it('calls fetchUrl with an nonexisting url and expects an exception', async () => {
        expect.assertions(1);
        const oResult = await AbstractToJson.fetchUrl(
            'https://www.klhsfljkag.com/ydasdadad/adsaakhjg/jahsgajhvas.html'
        ).catch(e => {
            expect(e.message).toBe('getaddrinfo ENOTFOUND www.klhsfljkag.com www.klhsfljkag.com:443');
        });
    });

    it('calls fetchUrl returning the sites source', async () => {
        expect.assertions(2);
        const oResult = await AbstractToJson.fetchUrl('https://github.com/maugenst/pagetojson#readme');
        expect(typeof oResult === 'string').toBeTruthy();
        expect(oResult).toEqual(
            expect.stringContaining('maugenst/pagetojson: Convert HTML page parts into JSON objects')
        );
    });
    */
});
