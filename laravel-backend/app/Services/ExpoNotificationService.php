<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ExpoNotificationService
{
    private Client $client;
    private const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

    public function __construct()
    {
        $this->client = new Client();
    }

    /**
     * Enviar notificación push a través de Expo
     *
     * @param string|array $tokens - Token(s) Expo del dispositivo
     * @param string $title - Título de la notificación
     * @param string $body - Cuerpo de la notificación
     * @param array $data - Datos adicionales
     * @return bool
     */
    public function sendNotification($tokens, string $title, string $body, array $data = []): bool
    {
        // Convertir token único a array
        $tokens = is_array($tokens) ? $tokens : [$tokens];

        if (empty($tokens)) {
            Log::warning('ExpoNotificationService: No hay tokens disponibles');
            return false;
        }

        try {
            $payload = [];

            foreach ($tokens as $token) {
                if (!$this->isValidExpoToken($token)) {
                    Log::warning("ExpoNotificationService: Token inválido - {$token}");
                    continue;
                }

                $payload[] = [
                    'to' => $token,
                    'sound' => 'default',
                    'title' => $title,
                    'body' => $body,
                    'data' => $data,
                    'badge' => 1,
                    'priority' => 'high',
                ];
            }

            if (empty($payload)) {
                Log::warning('ExpoNotificationService: No hay tokens válidos para enviar');
                return false;
            }

            // Enviar todas las notificaciones
            $response = $this->client->post(self::EXPO_API_URL, [
                'json' => $payload,
                'timeout' => 10,
            ]);

            $statusCode = $response->getStatusCode();

            if ($statusCode === 200) {
                Log::info("ExpoNotificationService: Notificación enviada exitosamente", [
                    'tokens_count' => count($payload),
                    'title' => $title,
                ]);
                return true;
            }

            Log::error("ExpoNotificationService: Error en respuesta de Expo", [
                'status_code' => $statusCode,
                'response' => $response->getBody()->getContents(),
            ]);

            return false;

        } catch (\Exception $e) {
            Log::error('ExpoNotificationService: Excepción al enviar notificación', [
                'message' => $e->getMessage(),
                'title' => $title,
            ]);
            return false;
        }
    }

    /**
     * Validar si un token tiene formato válido de Expo
     *
     * @param string $token
     * @return bool
     */
    private function isValidExpoToken(string $token): bool
    {
        // Los tokens de Expo comienzan con 'ExponentPushToken['
        return preg_match('/^ExponentPushToken\[[\w-]+\]$/', $token) === 1;
    }

    /**
     * Enviar notificación a múltiples usuarios (útil para admin)
     *
     * @param array $users - Array de usuarios o IDs
     * @param string $title
     * @param string $body
     * @param array $data
     * @return int - Cantidad de notificaciones enviadas
     */
    public function sendToUsers($users, string $title, string $body, array $data = []): int
    {
        $sentCount = 0;

        foreach ($users as $user) {
            $tokens = $user->pushTokens()->active()->pluck('token')->toArray();

            if (!empty($tokens)) {
                if ($this->sendNotification($tokens, $title, $body, $data)) {
                    $sentCount++;
                }
            }
        }

        return $sentCount;
    }
}
