import { generateHashFromAddress, MapServiceAreaFromSeed } from './utils';

describe('Utils functions', () => {
  describe('generateHashFromAddress', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error with predefined message', () => {
      jest.mock('crypto', () => ({
        createHash: () => ({
          update: () => ({
            digest: () => {
              throw new Error('Unexpected error');
            },
          }),
        }),
      }));

      try {
        generateHashFromAddress('Aurelius Street, 764 Aurora');
      } catch (error) {
        expect(error.message).toBe(
          'An error occurred whilst generating hash from address: Unexpected error',
        );
      }
    });

    it('Should return MD5 hashes as string from given string', () => {
      expect.assertions(2);
      jest.mock('crypto', () => ({
        createHash: () => ({
          update: () => ({
            digest: () => '42311bbcc555b695cdff6c9df3ec2294',
          }),
        }),
      }));

      const hashResult = generateHashFromAddress('Aurelius Street, 764 Aurora');
      expect(hashResult).toHaveLength(32);
      expect(typeof hashResult).toBe('string');
    });
  });

  describe('MapServiceAreaFromSeed', () => {
    const seedPolygonExample = [
      {
        type: 'Polygon',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-0.235433186492287, 51.40314958578483, 0],
              [-0.235972869652187, 51.40412529534615, 0],
            ],
          ],
        },
        properties: {
          Description:
            '<html xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:msxsl="urn:schemas-microsoft-com:xslt"> <head> <META http-equiv="Content-Type" content="text/html"> <meta http-equiv="content-type" content="text/html; charset=UTF-8"> </head> <body style="margin:0px 0px 0px 0px;overflow:auto;background:#FFFFFF;"> <table style="font-family:Arial,Verdana,Times;font-size:12px;text-align:left;width:100%;border-collapse:collapse;padding:3px 3px 3px 3px"> <tr style="text-align:center;font-weight:bold;background:#9CBCE2"> <td>LONSOUTHWEST-EXT</td> </tr> <tr> <td> <table style="font-family:Arial,Verdana,Times;font-size:12px;text-align:left;width:100%;border-spacing:0px; padding:3px 3px 3px 3px"> <tr> <td>SA</td> <td>LONSOUTHWEST-EXT</td> </tr> </table> </td> </tr> </table> </body> </html>',
          Name: 'LONSOUTHWEST-EXT',
        },
      },
    ];

    it('Should return mapped Service Area', () => {
      const expectedArrayValue = [
        {
          name: 'LONSOUTHWEST-EXT',
          location: {
            type: 'Polygon',
            coordinates: [
              [
                [-0.235433186492287, 51.40314958578483, 0],
                [-0.235972869652187, 51.40412529534615, 0],
              ],
            ],
          },
        },
      ];
      const districtsToBeInsertedInDB = MapServiceAreaFromSeed(
        seedPolygonExample,
      );
      expect(districtsToBeInsertedInDB).toEqual(expectedArrayValue);
    });
  });
});
