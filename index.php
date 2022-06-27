<?php
use Kirby\Panel\Field;

Kirby::plugin('hananils/modules-inline', [
    'areas' => [
        'site' => function ($kirby) {
            return [
                'dialogs' => [
                    'page.create' => [
                        'load' => function () use ($kirby) {
                            $response = $kirby
                                ->core()
                                ->area('site')
                                ['dialogs']['page.create']['load']();

                            // Pass modules information
                            $response['props']['fields'][
                                'modules'
                            ] = Field::hidden();
                            $response['props']['value']['modules'] =
                                $kirby->request()->get('modules') ?? false;

                            return $response;
                        },
                        'submit' => function () use ($kirby) {
                            $request = $kirby->request();
                            $response = $kirby
                                ->core()
                                ->area('site')
                                ['dialogs']['page.create']['submit']();

                            // Don't redirect if section uses module layout
                            if ($request->get('modules') === 'module') {
                                unset($response['redirect']);
                            }

                            return $response;
                        }
                    ]
                ]
            ];
        }
    ]
]);
